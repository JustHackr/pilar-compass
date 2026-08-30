import { SCHOOL } from "@/config/school";
import { TKA_DONE_COOKIE } from "@/lib/tka/onboardingLock";

export const EMAIL_KEY = "pilar_compass_email";
const UNLOCKED_KEY = "pilar_compass_unlocked_at";

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
}

function clearCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function getStoredEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(EMAIL_KEY);
}

export function isUnlocked(): boolean {
  return Boolean(getStoredEmail());
}

export function unlockSession(email: string): void {
  const key = email.trim().toLowerCase();
  localStorage.setItem(EMAIL_KEY, key);
  localStorage.setItem(UNLOCKED_KEY, new Date().toISOString());
  writeCookie(EMAIL_KEY, key);
}

export function clearSession(): void {
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(UNLOCKED_KEY);
  clearCookie(EMAIL_KEY);
  clearCookie(TKA_DONE_COOKIE);
}

export function restoreStoredEmail(): string | null {
  const stored = getStoredEmail();
  if (!stored) return null;
  if (!isValidEmail(stored)) {
    clearSession();
    return null;
  }
  return stored;
}

export const SCHOOL_EMAIL_DOMAIN = SCHOOL.emailDomain;

export function isValidEmail(email: string): boolean {
  const t = email.trim().toLowerCase();
  const at = t.lastIndexOf("@");
  if (at <= 0) return false;
  const local = t.slice(0, at);
  const domain = t.slice(at + 1);
  if (!local || local.includes(" ") || domain.includes(" ")) return false;
  return domain === SCHOOL_EMAIL_DOMAIN;
}
