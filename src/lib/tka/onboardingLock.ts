import type { TkaPublicMe } from "./types";

export const TKA_DONE_COOKIE = "pilar_tka_done";

function doneKey(email: string): string {
  return `pilar_compass_tka_done:${email.toLowerCase().trim()}`;
}

function storage(): Storage | null {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
}

export function isTkaOnboarded(email: string): boolean {
  const key = email.toLowerCase().trim();
  if (!key) return false;
  return storage()?.getItem(doneKey(key)) === "1";
}

export function markTkaOnboarded(email: string): void {
  const key = email.toLowerCase().trim();
  if (!key) return;
  try {
    storage()?.setItem(doneKey(key), "1");
  } catch {
    /* ignore quota */
  }
  writeCookie(TKA_DONE_COOKIE, key);
}

export function emptyOnboardedMe(email: string): TkaPublicMe {
  const key = email.toLowerCase().trim();
  return {
    email: key,
    profile: {
      email: key,
      displayName: key.split("@")[0] || "Student",
      age: 17,
      tkaTrack: "12",
      kelas: "12-RIO-DE-JANEIRO",
      pilihanIds: ["fisika", "kimia"],
      onboardingCompletedAt: "2026-01-01T00:00:00.000Z",
      streakCount: 0,
      streakLastDate: null,
    },
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

export function blankMe(email: string): TkaPublicMe {
  const key = email.toLowerCase().trim();
  return {
    email: key,
    profile: null,
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
