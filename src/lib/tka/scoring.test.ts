import { describe, expect, it } from "vitest";
import {
  gradeItem,
  monthlyActivityScore,
  xpForOutcome,
  XP_FIRST_TRY,
  XP_REDEMPTION,
  XP_REVEALED,
  type TkaQuestion,
} from "./scoring";

const pg: TkaQuestion = {
  id: "q1",
  skillId: "spl",
  type: "pg",
  stem: "1+1",
  choices: ["1", "2", "3", "4", "5"],
  key: 1,
  hint: "add",
  explanation: "2",
};

const pgk: TkaQuestion = {
  id: "q2",
  skillId: "program_linear",
  type: "pgk",
  stem: "Benar atau salah",
  statements: [
    { id: "A", text: "A", correct: false },
    { id: "B", text: "B", correct: false },
    { id: "C", text: "C", correct: true },
  ],
  hint: "check C",
  explanation: "only C",
};

describe("scoring", () => {
  it("grades PG by index", () => {
    expect(gradeItem(pg, { kind: "pg", choice: 1 })).toBe(true);
    expect(gradeItem(pg, { kind: "pg", choice: 0 })).toBe(false);
  });

  it("requires every PGK statement to match", () => {
    expect(
      gradeItem(pgk, {
        kind: "pgk",
        answers: { A: false, B: false, C: true },
      }),
    ).toBe(true);
    expect(
      gradeItem(pgk, {
        kind: "pgk",
        answers: { A: true, B: false, C: true },
      }),
    ).toBe(false);
  });

  it("maps XP by outcome", () => {
    expect(xpForOutcome("first_try")).toBe(XP_FIRST_TRY);
    expect(xpForOutcome("redemption")).toBe(XP_REDEMPTION);
    expect(xpForOutcome("revealed")).toBe(XP_REVEALED);
  });

  it("sums monthly activity", () => {
    expect(
      monthlyActivityScore({
        lessonsCompleted: 3,
        tryoutsSubmitted: 1,
        streakCounted: true,
      }),
    ).toBe(5);
  });
});
