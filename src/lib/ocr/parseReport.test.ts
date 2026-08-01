import { describe, expect, it } from "vitest";
import { meanWordConfidence, parseReportText } from "./parseReport";

describe("parseReportText", () => {
  it("parses Indonesian subject lines", () => {
    const text = `
      Matematika 91
      Bahasa Inggris: 88
      Fisika — 85
      Informatika 93%
    `;
    const result = parseReportText(text, 72);
    expect(result.ok).toBe(true);
    expect(result.subjects).toEqual([
      { name: "Matematika", score: 91 },
      { name: "Bahasa Inggris", score: 88 },
      { name: "Fisika", score: 85 },
      { name: "Informatika", score: 93 },
    ]);
  });

  it("parses English subject lines", () => {
    const text = "Mathematics 90\nScience 84\nHistory 78";
    const result = parseReportText(text, 60);
    expect(result.ok).toBe(true);
    expect(result.subjects).toHaveLength(3);
  });

  it("rejects low confidence with few subjects", () => {
    const text = "Math 80\nEnglish 70";
    const result = parseReportText(text, 35);
    expect(result.ok).toBe(false);
    expect(result.subjects).toHaveLength(2);
  });

  it("skips headers and totals", () => {
    const text = `
      Nilai 100
      Mata Pelajaran 80
      Matematika 88
      Bahasa Indonesia 90
      Rata-rata 89
    `;
    const result = parseReportText(text, 70);
    expect(result.subjects.map((s) => s.name)).toEqual([
      "Matematika",
      "Bahasa Indonesia",
    ]);
  });
});

describe("meanWordConfidence", () => {
  it("averages word confidences", () => {
    expect(
      meanWordConfidence([{ confidence: 80 }, { confidence: 60 }]),
    ).toBe(70);
  });
});
