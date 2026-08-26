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

export type ActivityEvent = {
  id: string;
  at: string;
  email: string;
  type: string;
  path?: string;
  detail?: string;
  meta?: Record<string, string | number | boolean | null>;
};

export type TkaPublicMe = {
  email: string;
  profile: TkaProfile | null;
  today: {
    lessonsCompleted: number;
    tryoutsSubmitted: number;
    xpEarned: number;
    streakCounted: boolean;
  };
  monthXp: number;
  monthScore: number;
  mastery: SkillMastery[];
};

export type TkaDb = {
  profiles: Record<string, TkaProfile>;
  daily: DailyActivity[];
  lessons: LessonAttempt[];
  tryouts: TryoutAttempt[];
  mastery: Record<string, SkillMastery>;
  otps: Record<string, OtpRecord>;
  events: ActivityEvent[];
};

export function emptyDb(): TkaDb {
  return {
    profiles: {},
    daily: [],
    lessons: [],
    tryouts: [],
    mastery: {},
    otps: {},
    events: [],
  };
}

export function masteryKey(email: string, skillId: string): string {
  return `${email}::${skillId}`;
}

