export type PgQuestion = {
  id: string;
  skillId: string;
  type: "pg";
  stem: string;
  choices: string[];
  key: number;
  hint: string;
  explanation: string;
  image?: string;
  source?: "official" | "latihan";
};

export type PgkStatement = {
  id: string;
  text: string;
  correct: boolean;
};

export type PgkQuestion = {
  id: string;
  skillId: string;
  type: "pgk";
  stem: string;
  statements: PgkStatement[];
  hint: string;
  explanation: string;
  image?: string;
  source?: "official" | "latihan";
};

export type TkaQuestion = PgQuestion | PgkQuestion;

export type PgkAnswer = Record<string, boolean>;

export type LessonCheck =
  | { kind: "pg"; choice: number }
  | { kind: "pgk"; answers: PgkAnswer };

export type ItemOutcome = "first_try" | "redemption" | "revealed";

export const XP_FIRST_TRY = 20;
export const XP_REDEMPTION = 10;
export const XP_REVEALED = 0;
export const XP_LESSON_BONUS = 15;

export function isPg(q: TkaQuestion): q is PgQuestion {
  return q.type === "pg";
}

export function gradeItem(question: TkaQuestion, check: LessonCheck): boolean {
  if (question.type === "pg") {
    if (check.kind !== "pg") return false;
    return check.choice === question.key;
  }
  if (check.kind !== "pgk") return false;
  return question.statements.every((s) => check.answers[s.id] === s.correct);
}

export function xpForOutcome(outcome: ItemOutcome): number {
  if (outcome === "first_try") return XP_FIRST_TRY;
  if (outcome === "redemption") return XP_REDEMPTION;
  return XP_REVEALED;
}

export function monthlyActivityScore(row: {
  lessonsCompleted: number;
  tryoutsSubmitted: number;
  streakCounted: boolean;
}): number {
  return (
    row.lessonsCompleted +
    row.tryoutsSubmitted +
    (row.streakCounted ? 1 : 0)
  );
}
