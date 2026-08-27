import { describe, expect, it } from "vitest";
import { ADMIN_EMAIL, SPI_CLASSES } from "@/data/spi-classes";
import { buildAdminOverview } from "./admin";
import { demoDb, DEMO_STUDENT_EMAIL } from "./demo";

describe("demo TKA school", () => {
  it("seeds onboarded students into every SPI homeroom", () => {
    const db = demoDb();
    const overview = buildAdminOverview(db);

    expect(overview.classes).toHaveLength(SPI_CLASSES.length);
    expect(overview.classes.every((c) => c.students >= 2)).toBe(true);
    expect(overview.unmatchedKelas).toEqual([]);
    expect(overview.kpis.classesWithStudents).toBe(SPI_CLASSES.length);
    expect(db.profiles[ADMIN_EMAIL]?.onboardingCompletedAt).toBeTruthy();
    expect(db.profiles[DEMO_STUDENT_EMAIL]?.kelas).toBe("12-RIO-DE-JANEIRO");
    expect(db.profiles["quasarian.insanity@pilar.sch.id"]).toBeUndefined();
  });

  it("starts everyone at zero on the leaderboard", () => {
    const db = demoDb();
    const overview = buildAdminOverview(db);

    expect(overview.kpis.onboarded).toBeGreaterThan(20);
    expect(db.daily).toEqual([]);
    expect(Object.values(db.profiles).every((p) => p.streakCount === 0)).toBe(true);
    expect(overview.classes.every((c) => c.roster.every((row) => row.monthScore === 0 && row.streak === 0))).toBe(
      true,
    );
  });
});
