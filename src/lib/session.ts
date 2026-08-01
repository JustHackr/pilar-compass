const EMAIL_KEY = "pilar_compass_email";
const UNLOCKED_KEY = "pilar_compass_unlocked_at";

export function getStoredEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(EMAIL_KEY);
}

export function isUnlocked(): boolean {
  return Boolean(getStoredEmail());
}

export function unlockSession(email: string): void {
  localStorage.setItem(EMAIL_KEY, email.trim());
  localStorage.setItem(UNLOCKED_KEY, new Date().toISOString());
}

export function clearSession(): void {
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(UNLOCKED_KEY);
}

export function isValidEmail(email: string): boolean {
  const t = email.trim();
  return t.includes("@") && t.includes(".") && t.length >= 5 && !t.includes(" ");
}
