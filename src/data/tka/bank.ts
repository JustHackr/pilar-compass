import { GRADE12_MATH_QUESTIONS } from "@/data/tka/questions";
import { GRADE12_MATH_SKILLS, type TkaSkill } from "@/data/tka/skills";
import type { TkaQuestion } from "@/lib/tka/scoring";

export function questionsForSubject(subjectId: string): TkaQuestion[] {
  if (subjectId !== "matematika") return [];
  return GRADE12_MATH_QUESTIONS;
}

export function questionById(id: string): TkaQuestion | undefined {
  return GRADE12_MATH_QUESTIONS.find((q) => q.id === id);
}

export function skillsForSubject(subjectId: string): TkaSkill[] {
  return GRADE12_MATH_SKILLS.filter((s) => s.subjectId === subjectId);
}

export function skillById(id: string): TkaSkill | undefined {
  return GRADE12_MATH_SKILLS.find((s) => s.id === id);
}
