import { GRADE12_BI_QUESTIONS } from "@/data/tka/bi-questions";
import { GRADE12_ELECTIVE_QUESTIONS } from "@/data/tka/elective-questions";
import { GRADE12_EN_QUESTIONS } from "@/data/tka/en-questions";
import { GRADE12_KIMIA_QUESTIONS } from "@/data/tka/kimia-questions";
import { GRADE12_MATH_QUESTIONS } from "@/data/tka/questions";
import { GRADE9_MATH_QUESTIONS } from "@/data/tka/smp-math-questions";
import {
  GRADE6_BI_QUESTIONS,
  GRADE6_MATH_QUESTIONS,
  GRADE9_BI_QUESTIONS,
  GRADE9_BUNDLE_MATH_QUESTIONS,
} from "@/data/tka/sd-smp-questions";
import { ALL_TKA_SKILLS, type TkaSkill } from "@/data/tka/skills";
import type { TkaTrack } from "@/lib/tka/grade";
import type { TkaQuestion } from "@/lib/tka/scoring";

export { figureForQuestion, passageForQuestion } from "@/data/tka/passages";

const ALL_QUESTIONS: TkaQuestion[] = [
  ...GRADE12_MATH_QUESTIONS,
  ...GRADE12_KIMIA_QUESTIONS,
  ...GRADE12_BI_QUESTIONS,
  ...GRADE12_EN_QUESTIONS,
  ...GRADE9_MATH_QUESTIONS,
  ...GRADE9_BUNDLE_MATH_QUESTIONS,
  ...GRADE6_BI_QUESTIONS,
  ...GRADE6_MATH_QUESTIONS,
  ...GRADE9_BI_QUESTIONS,
  ...GRADE12_ELECTIVE_QUESTIONS,
];

export function questionsForSubject(
  subjectId: string,
  track: TkaTrack = "12",
): TkaQuestion[] {
  const skillIds = new Set(
    ALL_TKA_SKILLS.filter(
      (s) => s.subjectId === subjectId && (s.track ?? "12") === track,
    ).map((s) => s.id),
  );
  return ALL_QUESTIONS.filter((q) => skillIds.has(q.skillId));
}

export function questionById(id: string): TkaQuestion | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}

export function skillsForSubject(subjectId: string, track: TkaTrack = "12"): TkaSkill[] {
  return ALL_TKA_SKILLS.filter(
    (s) => s.subjectId === subjectId && (s.track ?? "12") === track,
  );
}

export function skillById(id: string): TkaSkill | undefined {
  return ALL_TKA_SKILLS.find((s) => s.id === id);
}
