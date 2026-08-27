import { randomUUID } from "node:crypto";
import { questionById, questionsForSubject } from "@/data/tka/bank";
import { tryoutById } from "@/data/tka/tryouts";
import { isPilihanId } from "@/data/tka/catalog";
import { isAdminEmail, matchSpiClass } from "@/data/spi-classes";
import { isTkaTrack, normalizeKelas, type TkaTrack } from "./grade";
import { gradeItem, monthlyActivityScore, type LessonCheck } from "./scoring";
import { applyQualifyingActivity } from "./streak";
import { mutateStore, readStore } from "./store";
import {
  masteryKey,
  type ActivityEvent,
  type DailyActivity,
  type TkaProfile,
  type TkaPublicMe,
} from "./types";
import { pushEvent } from "./admin";
import { wibDateStr } from "./wib";

export function emailKey(email: string): string {
  return email.toLowerCase().trim();
}

export async function logActivity(
  event: Omit<ActivityEvent, "id" | "at"> & { at?: string },
): Promise<void> {
  await mutateStore((db) => {
    pushEvent(db, { ...event, email: emailKey(event.email) });
  });
}

function bumpDaily(
  daily: DailyActivity[],
  email: string,
  today: string,
  patch: Partial<Pick<DailyActivity, "lessonsCompleted" | "tryoutsSubmitted" | "xpEarned" | "streakCounted">>,
): void {
  let row = daily.find((d) => d.email === email && d.date === today);
  if (!row) {
    row = {
      email,
      date: today,
      lessonsCompleted: 0,
      tryoutsSubmitted: 0,
      xpEarned: 0,
      streakCounted: false,
    };
    daily.push(row);
  }
  row.lessonsCompleted += patch.lessonsCompleted ?? 0;
  row.tryoutsSubmitted += patch.tryoutsSubmitted ?? 0;
  row.xpEarned += patch.xpEarned ?? 0;
  if (patch.streakCounted) row.streakCounted = true;
}

export async function getProfile(email: string): Promise<TkaProfile | null> {
  const db = await readStore();
  return db.profiles[emailKey(email)] ?? null;
}

export async function publicMe(email: string) {
  const db = await readStore();
  const profile = db.profiles[email] ?? null;
  const today = wibDateStr();
  const todayRow = db.daily.find((d) => d.email === email && d.date === today);
  const monthPrefix = today.slice(0, 7);
  const monthXp = db.daily
    .filter((d) => d.email === email && d.date.startsWith(monthPrefix))
    .reduce((s, d) => s + d.xpEarned, 0);
  const monthScore = db.daily
    .filter((d) => d.email === email && d.date.startsWith(monthPrefix))
    .reduce((s, d) => s + monthlyActivityScore(d), 0);
  return {
    email,
    profile,
    today: {
      lessonsCompleted: todayRow?.lessonsCompleted ?? 0,
      tryoutsSubmitted: todayRow?.tryoutsSubmitted ?? 0,
      xpEarned: todayRow?.xpEarned ?? 0,
      streakCounted: todayRow?.streakCounted ?? false,
    },
    monthXp,
    monthScore,
    mastery: Object.values(db.mastery).filter((m) => m.email === email),
  };
}

export async function restoreStudentSnapshot(
  email: string,
  snapshot: TkaPublicMe,
): Promise<void> {
  const key = emailKey(email);
  if (emailKey(snapshot.email) !== key) return;
  const profile = snapshot.profile;
  if (!profile?.onboardingCompletedAt) return;

  await mutateStore((db) => {
    const current = db.profiles[key];
    const laterDate = (a: string | null | undefined, b: string | null | undefined) =>
      (a ?? "") >= (b ?? "") ? (a ?? null) : (b ?? null);
    db.profiles[key] = {
      ...profile,
      email: key,
      streakCount: Math.max(current?.streakCount ?? 0, profile.streakCount),
      streakLastDate: laterDate(current?.streakLastDate, profile.streakLastDate),
      onboardingCompletedAt:
        current?.onboardingCompletedAt ?? profile.onboardingCompletedAt,
    };
    for (const m of snapshot.mastery) {
      if (emailKey(m.email) !== key) continue;
      const id = masteryKey(key, m.skillId);
      const prev = db.mastery[id];
      if (
        !prev ||
        prev.updatedAt <= m.updatedAt ||
        (m.status === "mastered" && prev.status !== "mastered")
      ) {
        db.mastery[id] = { ...m, email: key };
      }
    }
    const today = wibDateStr();
    const cachedToday = snapshot.today;
    if (
      cachedToday.lessonsCompleted ||
      cachedToday.tryoutsSubmitted ||
      cachedToday.xpEarned ||
      cachedToday.streakCounted
    ) {
      const row = db.daily.find((d) => d.email === key && d.date === today);
      if (!row) {
        db.daily.push({
          email: key,
          date: today,
          lessonsCompleted: cachedToday.lessonsCompleted,
          tryoutsSubmitted: cachedToday.tryoutsSubmitted,
          xpEarned: cachedToday.xpEarned,
          streakCounted: cachedToday.streakCounted,
        });
      } else {
        row.lessonsCompleted = Math.max(row.lessonsCompleted, cachedToday.lessonsCompleted);
        row.tryoutsSubmitted = Math.max(row.tryoutsSubmitted, cachedToday.tryoutsSubmitted);
        row.xpEarned = Math.max(row.xpEarned, cachedToday.xpEarned);
        row.streakCounted = row.streakCounted || cachedToday.streakCounted;
      }
    }
  });
}

export async function saveOnboarding(
  email: string,
  input: {
    displayName: string;
    age: number;
    tkaTrack: string;
    kelas: string;
    pilihanIds: string[];
  },
): Promise<{ ok: true; profile: TkaProfile } | { ok: false; error: string }> {
  const name = input.displayName.trim();
  if (name.length < 2) return { ok: false, error: "name" };
  if (!Number.isInteger(input.age) || input.age < 8 || input.age > 22) {
    return { ok: false, error: "age" };
  }
  if (!isTkaTrack(input.tkaTrack)) return { ok: false, error: "track" };
  const spi = matchSpiClass(input.kelas);
  if (!spi || spi.tkaTrack !== input.tkaTrack) return { ok: false, error: "kelas" };
  const kelas = spi.id;
  const pilihan = [...new Set(input.pilihanIds.filter(isPilihanId))];
  if (input.tkaTrack === "12" && pilihan.length !== 2) {
    return { ok: false, error: "pilihan" };
  }
  if (input.tkaTrack !== "12" && pilihan.length !== 0) {
    return { ok: false, error: "pilihan" };
  }

  const profile = await mutateStore((db) => {
    const existing = db.profiles[email];
    const next: TkaProfile = {
      email,
      displayName: name,
      age: input.age,
      tkaTrack: input.tkaTrack as TkaTrack,
      kelas,
      pilihanIds: input.tkaTrack === "12" ? pilihan : [],
      onboardingCompletedAt: new Date().toISOString(),
      streakCount: existing?.streakCount ?? 0,
      streakLastDate: existing?.streakLastDate ?? null,
    };
    db.profiles[email] = next;
    pushEvent(db, {
      email,
      type: "onboarding",
      detail: `${name} · ${kelas} · track ${next.tkaTrack}`,
      meta: { kelas, track: next.tkaTrack, age: input.age },
    });
    return next;
  });
  return { ok: true, profile };
}

export async function ensureAdminProfile(email: string): Promise<void> {
  if (!isAdminEmail(email)) return;
  const key = emailKey(email);
  const existing = await getProfile(key);
  if (existing?.onboardingCompletedAt) return;
  await mutateStore((db) => {
    const current = db.profiles[key];
    if (current?.onboardingCompletedAt) return;
    db.profiles[key] = {
      email: key,
      displayName: "Pilar Admin",
      age: 18,
      tkaTrack: "12",
      kelas: "ADMIN",
      pilihanIds: ["fisika", "kimia"],
      onboardingCompletedAt: new Date().toISOString(),
      streakCount: current?.streakCount ?? 0,
      streakLastDate: current?.streakLastDate ?? null,
    };
  });
}

export async function completeLesson(input: {
  email: string;
  skillId: string;
  xp: number;
  outcomes: Record<string, import("./scoring").ItemOutcome>;
}) {
  const today = wibDateStr();
  return mutateStore((db) => {
    const profile = db.profiles[input.email];
    if (!profile?.onboardingCompletedAt) return { ok: false as const, error: "onboarding" };
    const xp = Math.max(0, Math.min(500, Math.floor(input.xp)));
    const streak = applyQualifyingActivity(
      { streakCount: profile.streakCount, streakLastDate: profile.streakLastDate },
      today,
    );
    profile.streakCount = streak.streakCount;
    profile.streakLastDate = streak.streakLastDate;
    bumpDaily(db.daily, input.email, today, {
      lessonsCompleted: 1,
      xpEarned: xp,
      streakCounted: true,
    });
    db.lessons.push({
      id: randomUUID(),
      email: input.email,
      skillId: input.skillId,
      finishedAt: new Date().toISOString(),
      xp,
      outcomes: input.outcomes,
    });
    const firstTries = Object.values(input.outcomes).filter((o) => o === "first_try").length;
    const total = Object.keys(input.outcomes).length;
    const status = total > 0 && firstTries / total >= 0.8 ? "mastered" : "learning";
    db.mastery[masteryKey(input.email, input.skillId)] = {
      email: input.email,
      skillId: input.skillId,
      status,
      updatedAt: new Date().toISOString(),
    };
    pushEvent(db, {
      email: input.email,
      type: "lesson_complete",
      detail: `${input.skillId} · ${xp} XP · ${status}`,
      meta: { skillId: input.skillId, xp, status },
    });
    return { ok: true as const, streakCount: profile.streakCount, xp };
  });
}

export async function submitTryout(input: {
  email: string;
  packId: string;
  durationSeconds: number;
  answers: Record<string, LessonCheck>;
}) {
  const pack = tryoutById(input.packId);
  if (!pack || pack.comingSoon) return { ok: false as const, error: "pack" };
  const questions = pack.questionIds
    .map(questionById)
    .filter((q): q is NonNullable<typeof q> => Boolean(q));
  const review = questions.map((q) => {
    const ans = input.answers[q.id];
    const ok = Boolean(ans && gradeItem(q, ans));
    return {
      id: q.id,
      skillId: q.skillId,
      correct: ok,
      explanation: q.explanation,
    };
  });
  const correct = review.filter((r) => r.correct).length;
  const total = questions.length;
  const scorePercent = total === 0 ? 0 : Math.round((correct / total) * 100);
  const today = wibDateStr();

  return mutateStore((db) => {
    const profile = db.profiles[input.email];
    if (!profile?.onboardingCompletedAt) return { ok: false as const, error: "onboarding" };
    const streak = applyQualifyingActivity(
      { streakCount: profile.streakCount, streakLastDate: profile.streakLastDate },
      today,
    );
    profile.streakCount = streak.streakCount;
    profile.streakLastDate = streak.streakLastDate;
    bumpDaily(db.daily, input.email, today, {
      tryoutsSubmitted: 1,
      streakCounted: true,
    });
    const attempt = {
      id: randomUUID(),
      email: input.email,
      packId: input.packId,
      submittedAt: new Date().toISOString(),
      scorePercent,
      durationSeconds: Math.max(0, Math.floor(input.durationSeconds)),
      correct,
      total,
    };
    db.tryouts.push(attempt);
    pushEvent(db, {
      email: input.email,
      type: "tryout_submit",
      detail: `${input.packId} · ${scorePercent}% (${correct}/${total})`,
      meta: { packId: input.packId, scorePercent, correct, total },
    });
    return { ok: true as const, attempt, streakCount: profile.streakCount, review };
  });
}

const PUBLIC_LEADERBOARD_NAMES = new Set(["quasarian insanity", "pilar admin"]);

function isPublicLeaderboardName(name: string): boolean {
  return PUBLIC_LEADERBOARD_NAMES.has(name.trim().toLowerCase());
}

export async function leaderboard(scope: "school" | "class", kelas?: string) {
  const db = await readStore();
  const today = wibDateStr();
  const monthPrefix = today.slice(0, 7);
  const scores = new Map<string, number>();
  for (const row of db.daily) {
    if (!row.date.startsWith(monthPrefix)) continue;
    scores.set(row.email, (scores.get(row.email) ?? 0) + monthlyActivityScore(row));
  }
  const rows = Object.values(db.profiles)
    .filter((p) => p.onboardingCompletedAt)
    .filter((p) => isPublicLeaderboardName(p.displayName))
    .filter((p) => (scope === "class" ? p.kelas === normalizeKelas(kelas || "") : true))
    .map((p) => ({
      displayName: p.displayName,
      kelas: p.kelas,
      score: scores.get(p.email) ?? 0,
      streakCount: p.streakCount,
    }))
    .sort((a, b) => b.score - a.score || b.streakCount - a.streakCount);
  return rows.map((r, i) => ({ rank: i + 1, ...r }));
}

export function subjectQuestionCount(subjectId: string): number {
  return questionsForSubject(subjectId).length;
}
