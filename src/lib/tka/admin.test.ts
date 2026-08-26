import { describe, expect, it } from "vitest";
import { SPI_CLASSES } from "@/data/spi-classes";
import { buildAdminOverview, pushEvent } from "./admin";
import { emptyDb, type TkaDb } from "./types";
import { wibDateStr } from "./wib";

function seededDb(): TkaDb {
  const db = emptyDb();
  const today = wibDateStr();
  db.profiles["ada@pilar.sch.id"] = {
    email: "ada@pilar.sch.id",
    displayName: "Ada",
    age: 17,
    tkaTrack: "12",
    kelas: "12-RIO-DE-JANEIRO",
    pilihanIds: ["fisika", "kimia"],
    onboardingCompletedAt: "2026-08-01T00:00:00.000Z",
    streakCount: 4,
    streakLastDate: today,
  };
  db.profiles["old@pilar.sch.id"] = {
    email: "old@pilar.sch.id",
    displayName: "Old Format",
    age: 17,
    tkaTrack: "12",
    kelas: "12-A",
    pilihanIds: ["ekonomi", "sejarah"],
    onboardingCompletedAt: "2026-08-02T00:00:00.000Z",
    streakCount: 1,
    streakLastDate: today,
  };
  db.profiles["admin@pilar.sch.id"] = {
    email: "admin@pilar.sch.id",
    displayName: "Pilar Admin",
    age: 18,
    tkaTrack: "12",
    kelas: "ADMIN",
    pilihanIds: ["fisika", "kimia"],
    onboardingCompletedAt: "2026-08-01T00:00:00.000Z",
    streakCount: 9,
    streakLastDate: today,
  };
  db.daily.push({
    email: "ada@pilar.sch.id",
    date: today,
    lessonsCompleted: 2,
    tryoutsSubmitted: 1,
    xpEarned: 40,
    streakCounted: true,
  });
  db.lessons.push({
    id: "l1",
    email: "ada@pilar.sch.id",
    skillId: "demo-skill",
    finishedAt: "2026-08-16T01:00:00.000Z",
    xp: 20,
    outcomes: { q1: "first_try", q2: "first_try" },
  });
  db.tryouts.push({
    id: "t1",
    email: "ada@pilar.sch.id",
    packId: "g12-math-official-1",
    submittedAt: "2026-08-16T02:00:00.000Z",
    scorePercent: 80,
    durationSeconds: 600,
    correct: 8,
    total: 10,
  });
  pushEvent(db, {
    email: "ada@pilar.sch.id",
    type: "page_view",
    path: "/tka",
  });
  return db;
}

describe("admin overview", () => {
  it("returns a zeroed row for every class on an empty store", () => {
    const overview = buildAdminOverview(emptyDb());
    expect(overview.classes).toHaveLength(SPI_CLASSES.length);
    expect(overview.classes.every((c) => c.students === 0 && c.lessons === 0)).toBe(
      true,
    );
    expect(overview.kpis.accounts).toBe(0);
    expect(overview.kpis.events).toBe(0);
    expect(overview.last14).toHaveLength(14);
    expect(overview.last14.at(-1)?.date).toBe(wibDateStr());
  });

  it("groups study under the matching city class and hides the admin account", () => {
    const overview = buildAdminOverview(seededDb());
    expect(overview.kpis.accounts).toBe(2);
    expect(overview.kpis.onboarded).toBe(2);
    expect(overview.kpis.activeToday).toBe(1);
    expect(overview.kpis.lessonsToday).toBe(2);

    const rio = overview.classes.find((c) => c.id === "12-RIO-DE-JANEIRO");
    const boston = overview.classes.find((c) => c.id === "4-BOSTON");
    expect(rio?.students).toBe(1);
    expect(rio?.lessons).toBe(1);
    expect(rio?.tryouts).toBe(1);
    expect(rio?.avgTryout).toBe(80);
    expect(rio?.lastActivityAt).toBe("2026-08-16T02:00:00.000Z");
    expect(rio?.roster[0]?.email).toBe("ada@pilar.sch.id");
    expect(overview.kpis.classesWithStudents).toBe(1);
    expect(boston?.students).toBe(0);
    expect(overview.unmatchedKelas).toEqual([
      { email: "old@pilar.sch.id", displayName: "Old Format", kelas: "12-A" },
    ]);
  });

  it("caps the activity log so the store cannot grow without bound", () => {
    const db = emptyDb();
    for (let i = 0; i < 2501; i += 1) {
      pushEvent(db, { email: "a@b.c", type: "page_view", path: `/${i}` });
    }
    expect(db.events).toHaveLength(2500);
    expect(db.events[0]?.path).toBe("/1");
    expect(db.events.at(-1)?.path).toBe("/2500");
  });
});
