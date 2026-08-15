import { describe, expect, it } from "vitest";
import { applyQualifyingActivity, streakBadges } from "./streak";

describe("streak", () => {
  it("starts at 1 on first activity", () => {
    const r = applyQualifyingActivity(
      { streakCount: 0, streakLastDate: null },
      "2026-08-15",
    );
    expect(r.streakCount).toBe(1);
    expect(r.incremented).toBe(true);
  });

  it("does not add extra days for a second activity the same day", () => {
    const r = applyQualifyingActivity(
      { streakCount: 4, streakLastDate: "2026-08-15" },
      "2026-08-15",
    );
    expect(r.streakCount).toBe(4);
    expect(r.incremented).toBe(false);
    expect(r.countedToday).toBe(true);
  });

  it("increments on consecutive days", () => {
    const r = applyQualifyingActivity(
      { streakCount: 4, streakLastDate: "2026-08-14" },
      "2026-08-15",
    );
    expect(r.streakCount).toBe(5);
  });

  it("resets after a missed day", () => {
    const r = applyQualifyingActivity(
      { streakCount: 12, streakLastDate: "2026-08-13" },
      "2026-08-15",
    );
    expect(r.streakCount).toBe(1);
  });

  it("unlocks badges at 3/7/14/30", () => {
    expect(streakBadges(7)).toEqual([3, 7]);
    expect(streakBadges(2)).toEqual([]);
  });
});
