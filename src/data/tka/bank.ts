import { GRADE12_KIMIA_QUESTIONS } from "@/data/tka/kimia-questions";
import { GRADE12_MATH_QUESTIONS } from "@/data/tka/questions";
import {
  ALL_TKA_SKILLS,
  GRADE12_KIMIA_SKILLS,
  GRADE12_MATH_SKILLS,
  type TkaSkill,
} from "@/data/tka/skills";
import type { TkaQuestion } from "@/lib/tka/scoring";

const ALL_QUESTIONS: TkaQuestion[] = [
  ...GRADE12_MATH_QUESTIONS,
  ...GRADE12_KIMIA_QUESTIONS,
];

export function questionsForSubject(subjectId: string): TkaQuestion[] {
  if (subjectId === "matematika") return GRADE12_MATH_QUESTIONS;
  if (subjectId === "kimia") return GRADE12_KIMIA_QUESTIONS;
  return [];
}

export function questionById(id: string): TkaQuestion | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}

export function skillsForSubject(subjectId: string): TkaSkill[] {
  if (subjectId === "matematika") return GRADE12_MATH_SKILLS;
  if (subjectId === "kimia") return GRADE12_KIMIA_SKILLS;
  return [];
}

export function skillById(id: string): TkaSkill | undefined {
  return ALL_TKA_SKILLS.find((s) => s.id === id);
}
