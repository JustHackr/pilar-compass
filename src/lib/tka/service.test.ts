import { beforeEach, describe, expect, it } from "vitest";
import { DEMO_STUDENT_EMAIL } from "./demo";
import {
  completeLesson,
  leaderboard,
  publicMe,
  restoreStudentSnapshot,
  saveOnboarding,
} from "./service";
import { mutateStore, resetStoreForTests } from "./store";
import { wibDateStr } from "./wib";

describe("leaderboard", () => {
  beforeEach(() => {
    resetStoreForTests();
  });

  it("lists a real student after they finish a lesson", async () => {
    const email = "ada@pilar.sch.id";
    const saved = await saveOnboarding(email, {
      displayName: "Ada",
      age: 17,
      tkaTrack: "12",
      kelas: "12-RIO-DE-JANEIRO",
      pilihanIds: ["fisika", "kimia"],
    });
    expect(saved.ok).toBe(true);

    const done = await completeLesson({
      email,
      skillId: "spl",
      xp: 40,
      outcomes: { q1: "first_try" },
    });
    expect(done.ok).toBe(true);

    const rows = await leaderboard("school");
    const ada = rows.find((r) => r.displayName === "Ada");
    expect(ada).toBeTruthy();
    expect(ada?.score).toBeGreaterThan(0);
    expect(ada?.streakCount).toBeGreaterThan(0);
  });

  it("hides demo roster names and Quasarian Insanity", async () => {
    const today = wibDateStr();
    await mutateStore((db) => {
      const extra = db.profiles[DEMO_STUDENT_EMAIL];
      if (extra) extra.streakCount = 12;
      db.daily.push({
        email: DEMO_STUDENT_EMAIL,
        date: today,
        lessonsCompleted: 9,
        tryoutsSubmitted: 3,
        xpEarned: 200,
        streakCounted: true,
      });
      db.profiles["quasarian.insanity@pilar.sch.id"] = {
        email: "quasarian.insanity@pilar.sch.id",
        displayName: "Quasarian Insanity",
        age: 18,
        tkaTrack: "12",
        kelas: "12-RIO-DE-JANEIRO",
        pilihanIds: ["fisika", "kimia"],
        onboardingCompletedAt: "2026-08-01T00:00:00.000Z",
        streakCount: 9,
        streakLastDate: today,
      };
    });

    const rows = await leaderboard("school");
    expect(rows.map((r) => r.displayName)).not.toContain("Rina Rio De Janeiro");
    expect(rows.map((r) => r.displayName)).not.toContain("Quasarian Insanity");
    expect(rows.map((r) => r.displayName)).not.toContain("Pilar Admin");
  });
});

describe("completeLesson", () => {
  beforeEach(() => {
    resetStoreForTests();
  });

  it("saves the lesson when the server forgot the profile but the client still has it", async () => {
    const email = "ada@pilar.sch.id";
    await saveOnboarding(email, {
      displayName: "Ada",
      age: 17,
      tkaTrack: "12",
      kelas: "12-RIO-DE-JANEIRO",
      pilihanIds: ["fisika", "kimia"],
    });
    const me = await publicMe(email);
    await mutateStore((db) => {
      delete db.profiles[email];
    });

    const done = await completeLesson({
      email,
      skillId: "spl",
      xp: 40,
      outcomes: { q1: "first_try" },
      snapshot: me,
    });
    expect(done.ok).toBe(true);

    const rows = await leaderboard("school");
    expect(rows.some((r) => r.displayName === "Ada" && r.score > 0)).toBe(true);
  });
});

describe("saveOnboarding", () => {
  beforeEach(() => {
    resetStoreForTests();
  });

  it("updates an existing profile and keeps the streak", async () => {
    await mutateStore((db) => {
      const row = db.profiles[DEMO_STUDENT_EMAIL];
      if (row) {
        row.streakCount = 7;
        row.streakLastDate = "2026-08-26";
      }
    });

    const result = await saveOnboarding(DEMO_STUDENT_EMAIL, {
      displayName: "Rina Corrected",
      age: 17,
      tkaTrack: "12",
      kelas: "12-RIO-DE-JANEIRO",
      pilihanIds: ["biologi", "ekonomi"],
    });

    expect(result.ok).toBe(true);
    const me = await publicMe(DEMO_STUDENT_EMAIL);
    expect(me.profile?.displayName).toBe("Rina Corrected");
    expect(me.profile?.pilihanIds).toEqual(["biologi", "ekonomi"]);
    expect(me.profile?.streakCount).toBe(7);
    expect(me.profile?.streakLastDate).toBe("2026-08-26");
  });

  it("lets a student move class and change electives", async () => {
    const result = await saveOnboarding(DEMO_STUDENT_EMAIL, {
      displayName: "Rina Rio De Janeiro",
      age: 17,
      tkaTrack: "12",
      kelas: "12-ROTTERDAM",
      pilihanIds: ["biologi", "ekonomi"],
    });
    expect(result.ok).toBe(true);
    const me = await publicMe(DEMO_STUDENT_EMAIL);
    expect(me.profile?.kelas).toBe("12-ROTTERDAM");
    expect(me.profile?.pilihanIds).toEqual(["biologi", "ekonomi"]);
  });

  it("stores a photo and keeps it when the name is edited later", async () => {
    const photo = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD";
    const first = await saveOnboarding(DEMO_STUDENT_EMAIL, {
      displayName: "Rina Rio De Janeiro",
      age: 18,
      tkaTrack: "12",
      kelas: "12-RIO-DE-JANEIRO",
      pilihanIds: ["fisika", "kimia"],
      avatarDataUrl: photo,
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.profile.avatarDataUrl).toBe(photo);

    const second = await saveOnboarding(DEMO_STUDENT_EMAIL, {
      displayName: "Rina Edited",
      age: 18,
      tkaTrack: "12",
      kelas: "12-RIO-DE-JANEIRO",
      pilihanIds: ["fisika", "kimia"],
    });
    expect(second.ok).toBe(true);
    const me = await publicMe(DEMO_STUDENT_EMAIL);
    expect(me.profile?.displayName).toBe("Rina Edited");
    expect(me.profile?.avatarDataUrl).toBe(photo);
  });

  it("rejects a non-image avatar and can clear a saved photo", async () => {
    const photo = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD";
    await saveOnboarding(DEMO_STUDENT_EMAIL, {
      displayName: "Rina Rio De Janeiro",
      age: 18,
      tkaTrack: "12",
      kelas: "12-RIO-DE-JANEIRO",
      pilihanIds: ["fisika", "kimia"],
      avatarDataUrl: photo,
    });

    const bad = await saveOnboarding(DEMO_STUDENT_EMAIL, {
      displayName: "Rina Rio De Janeiro",
      age: 18,
      tkaTrack: "12",
      kelas: "12-RIO-DE-JANEIRO",
      pilihanIds: ["fisika", "kimia"],
      avatarDataUrl: "javascript:alert(1)",
    });
    expect(bad.ok).toBe(false);

    const cleared = await saveOnboarding(DEMO_STUDENT_EMAIL, {
      displayName: "Rina Rio De Janeiro",
      age: 18,
      tkaTrack: "12",
      kelas: "12-RIO-DE-JANEIRO",
      pilihanIds: ["fisika", "kimia"],
      avatarDataUrl: null,
    });
    expect(cleared.ok).toBe(true);
    const me = await publicMe(DEMO_STUDENT_EMAIL);
    expect(me.profile?.avatarDataUrl ?? null).toBeNull();
  });
});

describe("restoreStudentSnapshot", () => {
  beforeEach(() => {
    resetStoreForTests();
  });

  it("writes cached streak, XP, and mastery back onto the student", async () => {
    const email = "ada@pilar.sch.id";
    await restoreStudentSnapshot(email, {
      email,
      profile: {
        email,
        displayName: "Ada",
        age: 17,
        tkaTrack: "12",
        kelas: "12-RIO-DE-JANEIRO",
        pilihanIds: ["fisika", "kimia"],
        onboardingCompletedAt: "2026-08-21T00:00:00.000Z",
        streakCount: 6,
        streakLastDate: "2026-08-27",
      },
      today: {
        lessonsCompleted: 2,
        tryoutsSubmitted: 0,
        xpEarned: 40,
        streakCounted: true,
      },
      monthXp: 40,
      monthScore: 3,
      mastery: [
        {
          email,
          skillId: "spl",
          status: "mastered",
          updatedAt: "2026-08-27T01:00:00.000Z",
        },
      ],
    });

    const me = await publicMe(email);
    expect(me.profile?.streakCount).toBe(6);
    expect(me.today.xpEarned).toBe(40);
    expect(me.mastery.some((m) => m.skillId === "spl" && m.status === "mastered")).toBe(true);
  });
});

describe("submitOsnPaper", () => {
  beforeEach(() => {
    resetStoreForTests();
  });

  it("stores a scored OSN archive attempt", async () => {
    const { submitOsnPaper } = await import("./service");
    const { loadOsnQuestions } = await import("@/lib/osn/loadQuestions");
    const questions = loadOsnQuestions("MjQ5");
    expect(questions.length).toBeGreaterThan(10);
    const answers: Record<string, number> = {};
    for (const q of questions.filter((item) => item.type === "pilgan").slice(0, 8)) {
      answers[q.id] = 0;
    }
    const result = await submitOsnPaper({
      email: "admin@pilar.sch.id",
      paperId: "MjQ5",
      durationSeconds: 45,
      answers,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.attempt.packId).toBe("osn:MjQ5");
    expect(result.total).toBeGreaterThan(8);
    expect(result.correct).toBe(8);
    expect(result.scorePercent).toBeGreaterThan(0);
  });
});
