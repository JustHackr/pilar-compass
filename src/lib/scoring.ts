import type {
  Affordability,
  CalculatorInput,
  ScoreBreakdown,
  ScoreResult,
} from "@/types";
import type { Locale } from "@/lib/i18n/dictionaries";
import { buildRoadmap } from "./roadmap";

export const WEIGHTS: Record<keyof ScoreBreakdown, number> = {
  academics: 0.45,
  tests: 0.2,
  financeFit: 0.15,
  timeline: 0.1,
  extras: 0.1,
};

export function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}

export function averageScores(
  subjects: { score: number }[],
): number {
  if (subjects.length === 0) return 0;
  const sum = subjects.reduce((acc, s) => acc + s.score, 0);
  return sum / subjects.length;
}

function normalizeToefl(toefl: number): number {
  // iBT roughly 0–120
  return clamp((toefl / 120) * 100);
}

function normalizeSat(sat: number): number {
  // Evidence-based reading+math roughly 400–1600
  return clamp(((sat - 400) / 1200) * 100);
}

function normalizeIelts(ielts: number): number {
  // 0–9 band
  return clamp((ielts / 9) * 100);
}

export function testsScore(input: CalculatorInput): number {
  const parts: number[] = [];
  if (input.toefl != null && input.toefl > 0) parts.push(normalizeToefl(input.toefl));
  if (input.sat != null && input.sat > 0) parts.push(normalizeSat(input.sat));
  if (input.ielts != null && input.ielts > 0) parts.push(normalizeIelts(input.ielts));
  if (parts.length === 0) return 55; // neutral when omitted
  return parts.reduce((a, b) => a + b, 0) / parts.length;
}

export function financeFitScore(
  affordability: Affordability,
  region: CalculatorInput["region"],
): number {
  const base: Record<Affordability, number> = {
    can_afford: 92,
    middle_class: 78,
    need_scholarship: 62,
    low_budget: 48,
  };
  let score = base[affordability];
  if (region === "abroad") {
    if (affordability === "low_budget") score -= 18;
    else if (affordability === "need_scholarship") score -= 10;
    else if (affordability === "middle_class") score -= 6;
  }
  return clamp(score);
}

export function timelineScore(age: number): number {
  if (age >= 15 && age <= 18) return 90;
  if (age === 14 || age === 19) return 75;
  if (age < 14) return 60;
  return 55;
}

export function extrasScore(input: CalculatorInput): number {
  const awards = Math.min(input.competitionAwards ?? 0, 8);
  const awardPts = (awards / 8) * 70;
  const majorBonus = input.intendedMajor?.trim() ? 30 : 10;
  return clamp(awardPts + majorBonus);
}

export function calculateMatch(
  input: CalculatorInput,
  locale: Locale = "en",
): ScoreResult {
  const averageScore = averageScores(input.subjects);
  const breakdown: ScoreBreakdown = {
    academics: clamp(averageScore),
    tests: testsScore(input),
    financeFit: financeFitScore(input.affordability, input.region),
    timeline: timelineScore(input.age),
    extras: extrasScore(input),
  };

  const raw =
    breakdown.academics * WEIGHTS.academics +
    breakdown.tests * WEIGHTS.tests +
    breakdown.financeFit * WEIGHTS.financeFit +
    breakdown.timeline * WEIGHTS.timeline +
    breakdown.extras * WEIGHTS.extras;

  const matchPercent = Math.round(clamp(raw));

  return {
    averageScore: Math.round(averageScore * 10) / 10,
    matchPercent,
    breakdown,
    weights: { ...WEIGHTS },
    roadmap: buildRoadmap(input, averageScore, matchPercent, locale),
  };
}
