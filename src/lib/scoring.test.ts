import { describe, expect, it } from "vitest";
import {
  averageScores,
  calculateMatch,
  clamp,
  financeFitScore,
  testsScore,
} from "./scoring";

describe("scoring", () => {
  it("averages subject scores", () => {
    expect(averageScores([{ score: 80 }, { score: 90 }])).toBe(85);
  });

  it("clamps values", () => {
    expect(clamp(120)).toBe(100);
    expect(clamp(-5)).toBe(0);
  });

  it("uses neutral tests score when omitted", () => {
    expect(
      testsScore({
        subjects: [{ name: "Math", score: 80 }],
        university: "ITB",
        country: "Indonesia",
        region: "indonesia",
        affordability: "middle_class",
        age: 17,
      }),
    ).toBe(55);
  });

  it("lowers finance fit abroad on low budget", () => {
    expect(financeFitScore("low_budget", "indonesia")).toBeGreaterThan(
      financeFitScore("low_budget", "abroad"),
    );
  });

  it("returns clamped match percent with roadmap", () => {
    const result = calculateMatch({
      subjects: [
        { name: "Math", score: 92 },
        { name: "English", score: 88 },
        { name: "Science", score: 90 },
      ],
      university: "ITB",
      country: "Indonesia",
      region: "indonesia",
      affordability: "middle_class",
      age: 17,
      intendedMajor: "CS",
      competitionAwards: 2,
      ielts: 7,
    });
    expect(result.matchPercent).toBeGreaterThan(60);
    expect(result.matchPercent).toBeLessThanOrEqual(100);
    expect(result.roadmap.length).toBeGreaterThanOrEqual(3);
  });
});
