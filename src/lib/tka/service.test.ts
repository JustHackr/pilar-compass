import { beforeEach, describe, expect, it } from "vitest";
import { leaderboard, publicMe, restoreStudentSnapshot } from "./service";
import { mutateStore, resetStoreForTests } from "./store";
import { wibDateStr } from "./wib";

describe("leaderboard", () => {
  beforeEach(() => {
    resetStoreForTests();
  });

  it("only publishes Quasarian Insanity and Pilar Admin", async () => {
    const rows = await leaderboard("school");
    expect(rows.map((r) => r.displayName).sort()).toEqual([
      "Pilar Admin",
      "Quasarian Insanity",
    ]);
    expect(rows.every((r) => r.score === 0 && r.streakCount === 0)).toBe(true);
  });

  it("wipes everyone else even if they have activity", async () => {
    const today = wibDateStr();
    await mutateStore((db) => {
      const extra = db.profiles["rina.12-rio-de-janeiro@pilar.sch.id"];
      if (extra) extra.streakCount = 12;
      db.daily.push({
        email: "rina.12-rio-de-janeiro@pilar.sch.id",
        date: today,
        lessonsCompleted: 9,
        tryoutsSubmitted: 3,
        xpEarned: 200,
        streakCounted: true,
      });
    });

    const rows = await leaderboard("school");
    expect(rows.map((r) => r.displayName)).not.toContain("Rina Rio De Janeiro");
    expect(rows).toHaveLength(2);
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
