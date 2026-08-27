import { describe, expect, it } from "vitest";
import type { OsnQuestion } from "@/data/osn/types";
import { scoreOsnPaper } from "./scoring";

const mcq = (
  id: string,
  extra: Partial<OsnQuestion> = {},
): OsnQuestion => ({
  id,
  number: 1,
  type: "pilgan",
  stemHtml: "<p>Q</p>",
  choices: ["A", "B", "C", "D"],
  ...extra,
});

const essay = (id: string): OsnQuestion => ({
  id,
  number: 2,
  type: "essay",
  stemHtml: "<p>E</p>",
  choices: [],
});

describe("scoreOsnPaper", () => {
  it("grades multiple choice against a published key", () => {
    const questions = [mcq("q1", { key: 2 }), mcq("q2", { key: 0 })];
    const result = scoreOsnPaper(questions, { q1: 2, q2: 1 });
    expect(result.total).toBe(2);
    expect(result.correct).toBe(1);
    expect(result.scorePercent).toBe(50);
    expect(result.review.map((r) => r.correct)).toEqual([true, false]);
  });

  it("counts unanswered multiple choice as wrong and skips essays", () => {
    const questions = [mcq("q1", { key: 1 }), essay("e1"), mcq("q2", { key: 0 })];
    const result = scoreOsnPaper(questions, { q1: 1 });
    expect(result.total).toBe(2);
    expect(result.correct).toBe(1);
    expect(result.scorePercent).toBe(50);
    expect(result.review.find((r) => r.id === "e1")?.kind).toBe("essay");
  });

  it("treats a selected choice as complete when the paper has no key", () => {
    const questions = [mcq("q1"), mcq("q2"), essay("e1")];
    const result = scoreOsnPaper(questions, { q1: 0 });
    expect(result.hasKeys).toBe(false);
    expect(result.total).toBe(2);
    expect(result.correct).toBe(1);
    expect(result.scorePercent).toBe(50);
  });
});
