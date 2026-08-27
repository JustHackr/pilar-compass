import { ADMIN_EMAIL, SPI_CLASSES } from "@/data/spi-classes";
import { emptyDb, type TkaDb, type TkaProfile } from "./types";
import { wibDateStr } from "./wib";

type DemoStudent = {
  first: string;
  age: number;
  pilihan?: [string, string];
};

const ROSTER: Record<string, DemoStudent[]> = {
  "4-BOSTON": [
    { first: "Alya", age: 10 },
    { first: "Rafi", age: 9 },
    { first: "Nina", age: 10 },
  ],
  "4-SYDNEY": [
    { first: "Bima", age: 10 },
    { first: "Salsa", age: 9 },
  ],
  "5-BERLIN": [
    { first: "Dio", age: 11 },
    { first: "Maya", age: 10 },
    { first: "Gilang", age: 11 },
  ],
  "5-BRUSSELS": [
    { first: "Intan", age: 11 },
    { first: "Fajar", age: 10 },
  ],
  "6-LEIDEN": [
    { first: "Putri", age: 12 },
    { first: "Arka", age: 11 },
    { first: "Luna", age: 12 },
  ],
  "7-ISTANBUL": [
    { first: "Naufal", age: 13 },
    { first: "Citra", age: 12 },
    { first: "Reza", age: 13 },
  ],
  "8-HELSINKI": [
    { first: "Hana", age: 14 },
    { first: "Yoga", age: 13 },
  ],
  "9-MANCHESTER": [
    { first: "Kirana", age: 15 },
    { first: "Dimas", age: 14 },
    { first: "Ayu", age: 15 },
  ],
  "10-ARIZONA": [
    { first: "Farhan", age: 16, pilihan: ["fisika", "kimia"] },
    { first: "Nadia", age: 15, pilihan: ["biologi", "kimia"] },
    { first: "Tegar", age: 16, pilihan: ["ekonomi", "sosiologi"] },
  ],
  "10-ADELAIDE": [
    { first: "Sari", age: 16, pilihan: ["geografi", "sejarah"] },
    { first: "Iqbal", age: 15, pilihan: ["ppkn", "sejarah"] },
  ],
  "11-ORLANDO": [
    { first: "Raka", age: 17, pilihan: ["fisika", "matematika_lanjut"] },
    { first: "Dewi", age: 16, pilihan: ["biologi", "kimia"] },
    { first: "Fikri", age: 17, pilihan: ["ekonomi", "geografi"] },
  ],
  "11-OXFORD": [
    { first: "Laras", age: 17, pilihan: ["sosiologi", "sejarah"] },
    { first: "Adit", age: 16, pilihan: ["fisika", "kimia"] },
  ],
  "12-RIO-DE-JANEIRO": [
    { first: "Rina", age: 18, pilihan: ["fisika", "kimia"] },
    { first: "Bayu", age: 17, pilihan: ["biologi", "kimia"] },
    { first: "Mega", age: 18, pilihan: ["ekonomi", "sosiologi"] },
  ],
  "12-ROTTERDAM": [
    { first: "Galih", age: 18, pilihan: ["matematika_lanjut", "fisika"] },
    { first: "Wulan", age: 17, pilihan: ["sejarah", "ppkn"] },
    { first: "Nanda", age: 18, pilihan: ["geografi", "ekonomi"] },
  ],
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

export function demoDb(now: Date = new Date()): TkaDb {
  const db = emptyDb();
  const onboardedAt = isoAt(shiftWib(wibDateStr(now), 20), 8, 0);

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

  db.profiles["quasarian.insanity@pilar.sch.id"] = {
    email: "quasarian.insanity@pilar.sch.id",
    displayName: "Quasarian Insanity",
    age: 18,
    tkaTrack: "12",
    kelas: "12-RIO-DE-JANEIRO",
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
        streakCount: 0,
        streakLastDate: null,
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
    }
  }

  db.events.sort((a, b) => a.at.localeCompare(b.at));
  return db;
}

export const DEMO_ADMIN_EMAIL = ADMIN_EMAIL;
export const DEMO_STUDENT_EMAIL = slugEmail("Rina", "12-RIO-DE-JANEIRO");
