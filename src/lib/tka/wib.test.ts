import { describe, expect, it } from "vitest";
import { daysBetweenWib, inCurrentMonth, monthKey, wibDateStr } from "./wib";

describe("wib", () => {
  it("formats a known instant as a WIB calendar date", () => {
    const utc = new Date("2026-08-15T17:30:00.000Z");
    expect(wibDateStr(utc)).toBe("2026-08-16");
  });

  it("counts whole WIB days between dates", () => {
    expect(daysBetweenWib("2026-08-14", "2026-08-15")).toBe(1);
    expect(daysBetweenWib("2026-08-14", "2026-08-16")).toBe(2);
  });

  it("detects the current month key", () => {
    const now = new Date("2026-08-15T03:00:00.000Z");
    expect(monthKey(now)).toBe("2026-08");
    expect(inCurrentMonth("2026-08-01", now)).toBe(true);
    expect(inCurrentMonth("2026-07-31", now)).toBe(false);
  });
});
