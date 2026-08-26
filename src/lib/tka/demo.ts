import { ADMIN_EMAIL, SPI_CLASSES, type SpiClass } from "@/data/spi-classes";
import { masteryKey, emptyDb, type TkaDb, type TkaProfile } from "./types";
import { wibDateStr } from "./wib";

type DemoStudent = {
  first: string;
  age: number;
  streak: number;
  pilihan?: [string, string];
};

const ROSTER: Record<string, DemoStudent[]> = {
  "4-BOSTON": [
    { first: "Alya", age: 10, streak: 6 },
    { first: "Rafi", age: 9, streak: 3 },
    { first: "Nina", age: 10, streak: 8 },
  ],
  "4-SYDNEY": [
    { first: "Bima", age: 10, streak: 4 },
    { first: "Salsa", age: 9, streak: 5 },
  ],
  "5-BERLIN": [
    { first: "Dio", age: 11, streak: 7 },
    { first: "Maya", age: 10, streak: 2 },
    { first: "Gilang", age: 11, streak: 9 },
  ],
  "5-BRUSSELS": [
    { first: "Intan", age: 11, streak: 5 },
    { first: "Fajar", age: 10, streak: 4 },
  ],
  "6-LEIDEN": [
    { first: "Putri", age: 12, streak: 11 },
    { first: "Arka", age: 11, streak: 6 },
    { first: "Luna", age: 12, streak: 3 },
  ],
  "7-ISTANBUL": [
    { first: "Naufal", age: 13, streak: 8 },
    { first: "Citra", age: 12, streak: 5 },
    { first: "Reza", age: 13, streak: 2 },
  ],
  "8-HELSINKI": [
    { first: "Hana", age: 14, streak: 10 },
    { first: "Yoga", age: 13, streak: 4 },
  ],
  "9-MANCHESTER": [
    { first: "Kirana", age: 15, streak: 12 },
    { first: "Dimas", age: 14, streak: 7 },
    { first: "Ayu", age: 15, streak: 5 },
  ],
  "10-ARIZONA": [
    { first: "Farhan", age: 16, streak: 9, pilihan: ["fisika", "kimia"] },
    { first: "Nadia", age: 15, streak: 6, pilihan: ["biologi", "kimia"] },
    { first: "Tegar", age: 16, streak: 3, pilihan: ["ekonomi", "sosiologi"] },
  ],
  "10-ADELAIDE": [
    { first: "Sari", age: 16, streak: 8, pilihan: ["geografi", "sejarah"] },
    { first: "Iqbal", age: 15, streak: 4, pilihan: ["ppkn", "sejarah"] },
  ],
  "11-ORLANDO": [
    { first: "Raka", age: 17, streak: 14, pilihan: ["fisika", "matematika_lanjut"] },
    { first: "Dewi", age: 16, streak: 7, pilihan: ["biologi", "kimia"] },
    { first: "Fikri", age: 17, streak: 5, pilihan: ["ekonomi", "geografi"] },
  ],
  "11-OXFORD": [
    { first: "Laras", age: 17, streak: 9, pilihan: ["sosiologi", "sejarah"] },
    { first: "Adit", age: 16, streak: 6, pilihan: ["fisika", "kimia"] },
  ],
  "12-RIO-DE-JANEIRO": [
    { first: "Rina", age: 18, streak: 16, pilihan: ["fisika", "kimia"] },
    { first: "Bayu", age: 17, streak: 8, pilihan: ["biologi", "kimia"] },
    { first: "Mega", age: 18, streak: 4, pilihan: ["ekonomi", "sosiologi"] },
  ],
  "12-ROTTERDAM": [
    { first: "Galih", age: 18, streak: 11, pilihan: ["matematika_lanjut", "fisika"] },
    { first: "Wulan", age: 17, streak: 7, pilihan: ["sejarah", "ppkn"] },
    { first: "Nanda", age: 18, streak: 5, pilihan: ["geografi", "ekonomi"] },
  ],
};

const SKILLS: Record<SpiClass["tkaTrack"], string[]> = {
  "6": ["m6-hitung", "m6-geometri", "bi6-tersurat", "m6-data"],
  "9": ["m9-pangkat", "m9-aljabar", "bi9-idepokok", "m9-data"],
  "12": ["spl", "invers", "bi-kosakata", "en-narrative", "ikatan", "fis-gerak"],
};

const PACKS: Record<SpiClass["tkaTrack"], string[]> = {
  "6": ["g6-math-bundle", "g6-bi-bundle"],
  "9": ["g9-math-official-2025", "g9-bi-bundle", "g9-math-bundle"],
  "12": ["g12-math-official-1", "g12-kimia-official-2025", "g12-bi-official-2025", "g12-en-official-2025"],
};

function slugEmail(first: string, kelas: string): string {
  return `${first}.${kelas}@pilar.sch.id`.toLowerCase();
}

function shiftWib(today: string, daysAgo: number): string {
  const ms = Date.parse(`${today}T12:00:00+07:00`) - daysAgo * 86_400_000;
  return wibDateStr(new Date(ms));
}

function isoAt(dateStr: string, hour: number, minute: number): string {
  return new Date(
    Date.parse(`${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+07:00`),
  ).toISOString();
}

function fingerprint(text: string): number {
  let n = 0;
  for (let i = 0; i < text.length; i += 1) n = (n * 33 + text.charCodeAt(i)) >>> 0;
  return n;
}

export function demoDb(now: Date = new Date()): TkaDb {
  const db = emptyDb();
  const today = wibDateStr(now);
  const onboardedAt = isoAt(shiftWib(today, 20), 8, 0);

  db.profiles[ADMIN_EMAIL] = {
    email: ADMIN_EMAIL,
    displayName: "Pilar Admin",
    age: 18,
    tkaTrack: "12",
    kelas: "ADMIN",
    pilihanIds: ["fisika", "kimia"],
    onboardingCompletedAt: onboardedAt,
    streakCount: 0,
    streakLastDate: null,
  };

  for (const spi of SPI_CLASSES) {
    const students = ROSTER[spi.id] ?? [];
    for (const student of students) {
      const email = slugEmail(student.first, spi.id);
      const profile: TkaProfile = {
        email,
        displayName: `${student.first} ${spi.city}`,
        age: student.age,
        tkaTrack: spi.tkaTrack,
        kelas: spi.id,
        pilihanIds: spi.tkaTrack === "12" ? (student.pilihan ?? ["fisika", "kimia"]) : [],
        onboardingCompletedAt: onboardedAt,
        streakCount: student.streak,
        streakLastDate: today,
      };
      db.profiles[email] = profile;
      db.events.push({
        id: `onboard-${email}`,
        at: onboardedAt,
        email,
        type: "onboarding",
        detail: `${profile.displayName} · ${spi.id} · track ${spi.tkaTrack}`,
        meta: { kelas: spi.id, track: spi.tkaTrack, age: student.age },
      });

      const seed = fingerprint(email);
      const activeDays = 4 + (seed % 6);
      for (let i = 0; i < activeDays; i += 1) {
        const date = shiftWib(today, i);
        const lessons = 1 + ((seed + i) % 3);
        const tryouts = (seed + i) % 4 === 0 ? 1 : 0;
        const xp = lessons * (12 + ((seed + i) % 10));
        db.daily.push({
          email,
          date,
          lessonsCompleted: lessons,
          tryoutsSubmitted: tryouts,
          xpEarned: xp,
          streakCounted: true,
        });

        const skill = SKILLS[spi.tkaTrack][(seed + i) % SKILLS[spi.tkaTrack].length];
        const mastered = (seed + i) % 3 !== 0;
        db.lessons.push({
          id: `lesson-${email}-${date}`,
          email,
          skillId: skill,
          finishedAt: isoAt(date, 15, (seed + i) % 50),
          xp,
          outcomes: mastered
            ? { q1: "first_try", q2: "first_try", q3: "first_try" }
            : { q1: "first_try", q2: "redemption", q3: "revealed" },
        });
        db.mastery[masteryKey(email, skill)] = {
          email,
          skillId: skill,
          status: mastered ? "mastered" : "learning",
          updatedAt: isoAt(date, 15, (seed + i) % 50),
        };
        db.events.push({
          id: `lesson-${email}-${date}`,
          at: isoAt(date, 15, (seed + i) % 50),
          email,
          type: "lesson_complete",
          path: `/tka/lesson/${skill}`,
          detail: `${skill} · ${xp} XP`,
          meta: { skillId: skill, xp, status: mastered ? "mastered" : "learning" },
        });

        if (tryouts) {
          const pack = PACKS[spi.tkaTrack][(seed + i) % PACKS[spi.tkaTrack].length];
          const score = 62 + ((seed + i * 7) % 35);
          db.tryouts.push({
            id: `tryout-${email}-${date}`,
            email,
            packId: pack,
            submittedAt: isoAt(date, 16, (seed + i) % 40),
            scorePercent: score,
            durationSeconds: 480 + ((seed + i) % 200),
            correct: Math.round(score / 10),
            total: 10,
          });
          db.events.push({
            id: `tryout-${email}-${date}`,
            at: isoAt(date, 16, (seed + i) % 40),
            email,
            type: "tryout_submit",
            path: `/tka/tryout/${pack}`,
            detail: `${pack} · ${score}%`,
            meta: { packId: pack, scorePercent: score },
          });
        }
      }

      db.events.push({
        id: `view-${email}`,
        at: isoAt(today, 9, seed % 40),
        email,
        type: "page_view",
        path: seed % 3 === 0 ? "/tka" : seed % 3 === 1 ? "/tka/leaderboard" : "/",
      });
    }
  }

  db.events.sort((a, b) => a.at.localeCompare(b.at));
  return db;
}

export const DEMO_ADMIN_EMAIL = ADMIN_EMAIL;
export const DEMO_STUDENT_EMAIL = slugEmail("Rina", "12-RIO-DE-JANEIRO");
