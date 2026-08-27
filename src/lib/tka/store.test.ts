import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ADMIN_EMAIL, SPI_CLASSES } from "@/data/spi-classes";
import { mutateStore, parseDb, readStore, resetStoreForTests } from "./store";

describe("tka store", () => {
  beforeEach(() => {
    resetStoreForTests();
  });

  it("fills missing collections so an old store file still loads", () => {
    const db = parseDb({ profiles: { "ada@pilar.sch.id": { email: "ada@pilar.sch.id" } } });
    expect(db.profiles["ada@pilar.sch.id"]?.email).toBe("ada@pilar.sch.id");
    expect(db.daily).toEqual([]);
    expect(db.events).toEqual([]);
  });

  it("starts from the demo roster instead of an empty database", async () => {
    const db = await readStore();
    expect(Object.keys(db.profiles).length).toBeGreaterThan(SPI_CLASSES.length * 2);
    expect(db.profiles[ADMIN_EMAIL]?.kelas).toBe("ADMIN");
    expect(db.daily).toEqual([]);
    expect(db.lessons).toEqual([]);
    expect(db.profiles["justin.rizki@pilar.sch.id"]).toBeUndefined();
  });

  it("keeps in-memory edits for the rest of the process", async () => {
    await mutateStore((db) => {
      db.profiles["guest@pilar.sch.id"] = {
        email: "guest@pilar.sch.id",
        displayName: "Guest",
        age: 16,
        tkaTrack: "12",
        kelas: "11-ORLANDO",
        pilihanIds: ["fisika", "kimia"],
        onboardingCompletedAt: "2026-08-21T00:00:00.000Z",
        streakCount: 1,
        streakLastDate: "2026-08-21",
      };
    });
    const db = await readStore();
    expect(db.profiles["guest@pilar.sch.id"]?.displayName).toBe("Guest");
  });
});

describe("tka store persistence", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(os.tmpdir(), "tka-store-"));
    process.env.TKA_STORE_PATH = path.join(dir, "tka-store.json");
    resetStoreForTests();
  });

  afterEach(() => {
    delete process.env.TKA_STORE_PATH;
    resetStoreForTests();
    rmSync(dir, { recursive: true, force: true });
  });

  it("reloads student lessons and streaks after memory is cleared", async () => {
    await mutateStore((db) => {
      db.profiles["ada@pilar.sch.id"] = {
        email: "ada@pilar.sch.id",
        displayName: "Ada",
        age: 17,
        tkaTrack: "12",
        kelas: "12-RIO-DE-JANEIRO",
        pilihanIds: ["fisika", "kimia"],
        onboardingCompletedAt: "2026-08-21T00:00:00.000Z",
        streakCount: 5,
        streakLastDate: "2026-08-27",
      };
      db.daily.push({
        email: "ada@pilar.sch.id",
        date: "2026-08-27",
        lessonsCompleted: 2,
        tryoutsSubmitted: 1,
        xpEarned: 55,
        streakCounted: true,
      });
      db.lessons.push({
        id: "lesson-1",
        email: "ada@pilar.sch.id",
        skillId: "spl",
        finishedAt: "2026-08-27T01:00:00.000Z",
        xp: 40,
        outcomes: { q1: "first_try" },
      });
      db.mastery["ada@pilar.sch.id::spl"] = {
        email: "ada@pilar.sch.id",
        skillId: "spl",
        status: "mastered",
        updatedAt: "2026-08-27T01:00:00.000Z",
      };
    });

    resetStoreForTests();
    const db = await readStore();
    expect(db.profiles["ada@pilar.sch.id"]?.streakCount).toBe(5);
    expect(db.daily).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: "ada@pilar.sch.id",
          lessonsCompleted: 2,
          xpEarned: 55,
        }),
      ]),
    );
    expect(db.lessons).toHaveLength(1);
    expect(db.mastery["ada@pilar.sch.id::spl"]?.status).toBe("mastered");
    expect(db.profiles[ADMIN_EMAIL]?.displayName).toBe("Pilar Admin");
  });
});
