import type { TkaProfile, TkaPublicMe } from "./types";
import { markTkaOnboarded } from "./onboardingLock";

function cacheKey(email: string): string {
  return `pilar_compass_tka_me:${email.toLowerCase().trim()}`;
}

function storage(): Storage | null {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export function readCachedMe(email: string): TkaPublicMe | null {
  const bag = storage();
  if (!bag || !email) return null;
  try {
    const raw = bag.getItem(cacheKey(email));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TkaPublicMe;
    if (!parsed || parsed.email !== email.toLowerCase().trim()) return null;
    if (parsed.profile?.onboardingCompletedAt) markTkaOnboarded(email);
    return parsed;
  } catch {
    return null;
  }
}

export function writeCachedMe(me: TkaPublicMe): void {
  const bag = storage();
  if (!bag || !me.email) return;
  try {
    bag.setItem(cacheKey(me.email), JSON.stringify(me));
    if (me.profile?.onboardingCompletedAt) markTkaOnboarded(me.email);
  } catch {
    /* ignore quota */
  }
}

export function cachedProfile(email: string): TkaProfile | null {
  return readCachedMe(email)?.profile ?? null;
}
