import { SPI_CLASSES, isAdminEmail, matchSpiClass, type SpiClass } from "@/data/spi-classes";
import { ALL_TKA_SKILLS } from "@/data/tka/skills";
import { TRYOUT_PACKS } from "@/data/tka/tryouts";
import { monthlyActivityScore } from "./scoring";
import type { ActivityEvent, TkaDb, TkaProfile } from "./types";
import { wibDateStr } from "./wib";

const MAX_EVENTS = 2500;

export function pushEvent(
  db: TkaDb,
  event: Omit<ActivityEvent, "id" | "at"> & { at?: string },
): void {
  db.events.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: event.at ?? new Date().toISOString(),
    email: event.email,
    type: event.type,
    path: event.path,
    detail: event.detail,
    meta: event.meta,
  });
  if (db.events.length > MAX_EVENTS) {
    db.events.splice(0, db.events.length - MAX_EVENTS);
  }
}

function studentsInClass(profiles: TkaProfile[], spi: SpiClass): TkaProfile[] {
  return profiles.filter((p) => matchSpiClass(p.kelas)?.id === spi.id);
}

function wibShift(dateStr: string, days: number): string {
  const ms = Date.parse(`${dateStr}T12:00:00+07:00`) + days * 86_400_000;
  return wibDateStr(new Date(ms));
}

export function buildAdminOverview(db: TkaDb) {
  const today = wibDateStr();
  const monthPrefix = today.slice(0, 7);
  const profiles = Object.values(db.profiles).filter((p) => !isAdminEmail(p.email));
  const onboarded = profiles.filter((p) => p.onboardingCompletedAt);
  const todayDaily = db.daily.filter((d) => d.date === today && !isAdminEmail(d.email));
  const monthDaily = db.daily.filter(
    (d) => d.date.startsWith(monthPrefix) && !isAdminEmail(d.email),
  );
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const key = wibShift(today, i - 13);
    const rows = db.daily.filter((x) => x.date === key && !isAdminEmail(x.email));
    return {
      date: key,
      lessons: rows.reduce((s, r) => s + r.lessonsCompleted, 0),
      tryouts: rows.reduce((s, r) => s + r.tryoutsSubmitted, 0),
      xp: rows.reduce((s, r) => s + r.xpEarned, 0),
      activeStudents: rows.length,
    };
  });

  const pageViews = db.events.filter((e) => e.type === "page_view");
  const pathCounts = new Map<string, number>();
  for (const e of pageViews) {
    const p = e.path || "/";
    pathCounts.set(p, (pathCounts.get(p) ?? 0) + 1);
  }

  const skillTitle = new Map(ALL_TKA_SKILLS.map((s) => [s.id, s.titleId]));
  const skillUse = new Map<string, { skillId: string; title: string; completions: number; mastered: number }>();
  for (const lesson of db.lessons) {
    const row = skillUse.get(lesson.skillId) ?? {
      skillId: lesson.skillId,
      title: skillTitle.get(lesson.skillId) ?? lesson.skillId,
      completions: 0,
      mastered: 0,
    };
    row.completions += 1;
    skillUse.set(lesson.skillId, row);
  }
  for (const m of Object.values(db.mastery)) {
    if (m.status !== "mastered") continue;
    const row = skillUse.get(m.skillId) ?? {
      skillId: m.skillId,
      title: skillTitle.get(m.skillId) ?? m.skillId,
      completions: 0,
      mastered: 0,
    };
    row.mastered += 1;
    skillUse.set(m.skillId, row);
  }

  const packTitle = new Map(TRYOUT_PACKS.map((p) => [p.id, p.titleId]));
  const packStats = new Map<
    string,
    { packId: string; title: string; attempts: number; avgScore: number; best: number }
  >();
  for (const t of db.tryouts) {
    const row = packStats.get(t.packId) ?? {
      packId: t.packId,
      title: packTitle.get(t.packId) ?? t.packId,
      attempts: 0,
      avgScore: 0,
      best: 0,
    };
    row.avgScore = (row.avgScore * row.attempts + t.scorePercent) / (row.attempts + 1);
    row.attempts += 1;
    row.best = Math.max(row.best, t.scorePercent);
    packStats.set(t.packId, row);
  }

  const classes = SPI_CLASSES.map((spi) => {
    const students = studentsInClass(onboarded, spi);
    const emails = new Set(students.map((s) => s.email));
    const lessons = db.lessons.filter((l) => emails.has(l.email));
    const tryouts = db.tryouts.filter((t) => emails.has(t.email));
    const monthXp = monthDaily
      .filter((d) => emails.has(d.email))
      .reduce((s, d) => s + d.xpEarned, 0);
    const todayActive = todayDaily.filter((d) => emails.has(d.email)).length;
    const firstTry = lessons.reduce(
      (s, l) => s + Object.values(l.outcomes).filter((o) => o === "first_try").length,
      0,
    );
    const items = lessons.reduce((s, l) => s + Object.keys(l.outcomes).length, 0);
    const roster = students
      .map((p) => {
        const score = monthDaily
          .filter((d) => d.email === p.email)
          .reduce((s, d) => s + monthlyActivityScore(d), 0);
        const lastLesson = [...lessons].reverse().find((l) => l.email === p.email);
        const lastTryout = [...tryouts].reverse().find((t) => t.email === p.email);
        return {
          email: p.email,
          displayName: p.displayName,
          age: p.age,
          track: p.tkaTrack,
          streak: p.streakCount,
          streakLastDate: p.streakLastDate,
          pilihan: p.pilihanIds,
          monthScore: score,
          lessons: db.lessons.filter((l) => l.email === p.email).length,
          tryouts: db.tryouts.filter((t) => t.email === p.email).length,
          lastLessonAt: lastLesson?.finishedAt ?? null,
          lastTryoutAt: lastTryout?.submittedAt ?? null,
          lastTryoutScore: lastTryout?.scorePercent ?? null,
        };
      })
      .sort((a, b) => b.monthScore - a.monthScore || b.streak - a.streak);
    const lastActivityAt = roster.reduce<string | null>((latest, row) => {
      const candidates = [row.lastLessonAt, row.lastTryoutAt, latest].filter(
        (x): x is string => Boolean(x),
      );
      if (candidates.length === 0) return null;
      return candidates.sort().at(-1) ?? null;
    }, null);
    return {
      ...spi,
      students: students.length,
      todayActive,
      monthXp,
      lessons: lessons.length,
      tryouts: tryouts.length,
      avgTryout:
        tryouts.length === 0
          ? 0
          : Math.round(tryouts.reduce((s, t) => s + t.scorePercent, 0) / tryouts.length),
      firstTryRate: items === 0 ? 0 : Math.round((firstTry / items) * 100),
      avgStreak:
        students.length === 0
          ? 0
          : Math.round(students.reduce((s, p) => s + p.streakCount, 0) / students.length),
      lastActivityAt,
      roster,
    };
  });

  const unmatched = onboarded.filter((p) => !matchSpiClass(p.kelas));

  return {
    generatedAt: new Date().toISOString(),
    today,
    demoStore: true,
    kpis: {
      accounts: profiles.length,
      onboarded: onboarded.length,
      activeToday: todayDaily.length,
      lessonsToday: todayDaily.reduce((s, d) => s + d.lessonsCompleted, 0),
      tryoutsToday: todayDaily.reduce((s, d) => s + d.tryoutsSubmitted, 0),
      xpToday: todayDaily.reduce((s, d) => s + d.xpEarned, 0),
      lessonsAll: db.lessons.filter((l) => !isAdminEmail(l.email)).length,
      tryoutsAll: db.tryouts.filter((t) => !isAdminEmail(t.email)).length,
      events: db.events.length,
      pageViews: pageViews.length,
      classesWithStudents: classes.filter((c) => c.students > 0).length,
      unmatched: unmatched.length,
    },
    last14,
    paths: [...pathCounts.entries()]
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
    eventTypes: countBy(db.events.map((e) => e.type)),
    recentEvents: [...db.events].reverse().slice(0, 80),
    skills: [...skillUse.values()].sort((a, b) => b.completions - a.completions).slice(0, 30),
    packs: [...packStats.values()].sort((a, b) => b.attempts - a.attempts),
    classes,
    unmatchedKelas: unmatched.map((p) => ({
      email: p.email,
      displayName: p.displayName,
      kelas: p.kelas,
    })),
  };
}

export type AdminOverview = ReturnType<typeof buildAdminOverview>;

function countBy(values: string[]): { type: string; count: number }[] {
  const map = new Map<string, number>();
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
  return [...map.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}
