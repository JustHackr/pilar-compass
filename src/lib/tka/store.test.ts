import { beforeEach, describe, expect, it } from "vitest";
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
    expect(db.lessons.length).toBeGreaterThan(0);
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
