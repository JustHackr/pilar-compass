import { describe, expect, it } from "vitest";
import { ADMIN_EMAIL, SPI_CLASSES } from "@/data/spi-classes";
import { buildAdminOverview } from "./admin";
import { demoDb, DEMO_STUDENT_EMAIL } from "./demo";
import { wibDateStr } from "./wib";

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
  });

  it("fills admin metrics so the dashboard and leaderboard have a workflow to show", () => {
    const db = demoDb();
    const overview = buildAdminOverview(db);
    const today = wibDateStr();

    expect(overview.kpis.onboarded).toBeGreaterThan(20);
    expect(overview.kpis.activeToday).toBeGreaterThan(0);
    expect(overview.kpis.lessonsToday).toBeGreaterThan(0);
    expect(overview.kpis.tryoutsToday).toBeGreaterThan(0);
    expect(overview.kpis.lessonsAll).toBeGreaterThan(overview.kpis.lessonsToday);
    expect(overview.kpis.tryoutsAll).toBeGreaterThan(0);
    expect(overview.last14.some((d) => d.date === today && d.lessons > 0)).toBe(true);
    expect(overview.last14.filter((d) => d.activeStudents > 0).length).toBeGreaterThan(3);
    expect(overview.skills.length).toBeGreaterThan(0);
    expect(overview.packs.length).toBeGreaterThan(0);
    expect(overview.recentEvents.length).toBeGreaterThan(0);
  });
});
