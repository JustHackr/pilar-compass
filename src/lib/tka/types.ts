import type { TkaTrack } from "@/lib/tka/grade";
import type { ItemOutcome } from "@/lib/tka/scoring";

export type TkaProfile = {
  email: string;
  displayName: string;
  age: number;
  tkaTrack: TkaTrack;
  kelas: string;
  pilihanIds: string[];
  onboardingCompletedAt: string | null;
  streakCount: number;
  streakLastDate: string | null;
};

export type DailyActivity = {
  email: string;
  date: string;
  lessonsCompleted: number;
  tryoutsSubmitted: number;
  xpEarned: number;
  streakCounted: boolean;
};

export type LessonAttempt = {
  id: string;
  email: string;
  skillId: string;
  finishedAt: string;
  xp: number;
  outcomes: Record<string, ItemOutcome>;
};

export type TryoutAttempt = {
  id: string;
  email: string;
  packId: string;
  submittedAt: string;
  scorePercent: number;
  durationSeconds: number;
  correct: number;
  total: number;
};

export type SkillMastery = {
  email: string;
  skillId: string;
  status: "unseen" | "learning" | "mastered";
  updatedAt: string;
};

export type OtpRecord = {
  email: string;
  hash: string;
  expiresAt: number;
};

export type TkaDb = {
  profiles: Record<string, TkaProfile>;
  daily: DailyActivity[];
  lessons: LessonAttempt[];
  tryouts: TryoutAttempt[];
  mastery: Record<string, SkillMastery>;
  otps: Record<string, OtpRecord>;
};

export function emptyDb(): TkaDb {
  return {
    profiles: {},
    daily: [],
    lessons: [],
    tryouts: [],
    mastery: {},
    otps: {},
  };
}

export function masteryKey(email: string, skillId: string): string {
  return `${email}::${skillId}`;
}
