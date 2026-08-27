import type { OsnQuestion } from "@/data/osn/types";

export type OsnReviewItem = {
  id: string;
  number: number;
  kind: "pilgan" | "essay";
  correct: boolean | null;
  choice: number | null;
};

export type OsnPaperScore = {
  hasKeys: boolean;
  correct: number;
  total: number;
  scorePercent: number;
  review: OsnReviewItem[];
};

export function scoreOsnPaper(
  questions: OsnQuestion[],
  answers: Record<string, number>,
): OsnPaperScore {
  const hasKeys = questions.some((q) => q.type === "pilgan" && typeof q.key === "number");
  const review: OsnReviewItem[] = questions.map((q) => {
    if (q.type === "essay") {
      return { id: q.id, number: q.number, kind: "essay", correct: null, choice: null };
    }
    const choice = Number.isInteger(answers[q.id]) ? answers[q.id] : null;
    const correct =
      choice === null
        ? false
        : typeof q.key === "number"
          ? choice === q.key
          : true;
    return { id: q.id, number: q.number, kind: "pilgan", correct, choice };
  });
  const scored = review.filter((r) => r.kind === "pilgan");
  const correct = scored.filter((r) => r.correct).length;
  const total = scored.length;
  return {
    hasKeys,
    correct,
    total,
    scorePercent: total === 0 ? 0 : Math.round((correct / total) * 100),
    review,
  };
}
