import { describe, expect, it } from "vitest";
import { OSN_PAPERS, OSN_SUBJECTS, papersForSubject, yearsForSubject } from "./bank";

describe("osn catalog", () => {
  it("has SD, SMP, and SMA fields from the archive", () => {
    const levels = new Set(OSN_SUBJECTS.map((s) => s.level));
    expect(levels).toEqual(new Set(["sd", "smp", "sma"]));
    expect(OSN_PAPERS.length).toBeGreaterThan(300);
  });

  it("lists SMA kimia papers newest year first", () => {
    const papers = papersForSubject("sma", "kimia");
    expect(papers.length).toBeGreaterThan(20);
    const years = papers.map((p) => p.year).filter((y): y is number => y != null);
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  it("exposes year filters in descending order", () => {
    const years = yearsForSubject("sma", "kimia");
    expect(years[0]).toBeGreaterThan(years[years.length - 1]!);
  });
});
