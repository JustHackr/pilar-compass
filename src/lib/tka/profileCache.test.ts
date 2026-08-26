import { beforeEach, describe, expect, it } from "vitest";
import { readCachedMe, writeCachedMe } from "./profileCache";
import type { TkaPublicMe } from "./types";

const mem = new Map<string, string>();

beforeEach(() => {
  mem.clear();
  globalThis.localStorage = {
    getItem: (key: string) => mem.get(key) ?? null,
    setItem: (key: string, value: string) => {
      mem.set(key, value);
    },
    removeItem: (key: string) => {
      mem.delete(key);
    },
    clear: () => mem.clear(),
    key: () => null,
    get length() {
      return mem.size;
    },
  } as Storage;
});

function me(email: string, completed: boolean): TkaPublicMe {
  return {
    email,
    profile: completed
      ? {
          email,
          displayName: "Justin",
          age: 17,
          tkaTrack: "12",
          kelas: "12-RIO-DE-JANEIRO",
          pilihanIds: ["fisika", "kimia"],
          onboardingCompletedAt: "2026-08-19T00:00:00.000Z",
          streakCount: 2,
          streakLastDate: "2026-08-19",
        }
      : null,
    today: {
      lessonsCompleted: 0,
      tryoutsSubmitted: 0,
      xpEarned: 0,
      streakCounted: false,
    },
    monthXp: 0,
    monthScore: 0,
    mastery: [],
  };
}

describe("profileCache", () => {
  it("remembers a completed TKA account for the same school email", () => {
    writeCachedMe(me("ada@pilar.sch.id", true));
    const cached = readCachedMe("ada@pilar.sch.id");
    expect(cached?.profile?.displayName).toBe("Justin");
    expect(cached?.profile?.onboardingCompletedAt).toBeTruthy();
  });

  it("does not leak one student account onto another email", () => {
    writeCachedMe(me("ada@pilar.sch.id", true));
    expect(readCachedMe("nina.4-boston@pilar.sch.id")).toBeNull();
  });

  it("keeps justin.rizki@pilar.sch.id after TKA setup so onboarding does not return", () => {
    writeCachedMe(me("justin.rizki@pilar.sch.id", true));
    expect(readCachedMe("justin.rizki@pilar.sch.id")?.profile?.onboardingCompletedAt).toBeTruthy();
  });
});
