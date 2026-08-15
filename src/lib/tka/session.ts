import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "tka_session";
const OTP_COOKIE = "tka_otp";
const MAX_AGE = 60 * 60 * 24 * 30;

function secret(): string {
  return process.env.TKA_SESSION_SECRET || "pilar-compass-tka-dev-only";
}

function sign(body: string): string {
  return createHmac("sha256", secret()).update(body).digest("base64url");
}

export function makeOtp(): string {
  return String(randomInt(100000, 1000000));
}

export function hashOtp(email: string, code: string): string {
  return createHmac("sha256", secret()).update(`${email}:${code}`).digest("hex");
}

export function otpMatches(email: string, code: string, hash: string): boolean {
  const a = Buffer.from(hashOtp(email, code));
  const b = Buffer.from(hash);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function encodeSession(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ email, exp: Date.now() + MAX_AGE * 1000 }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: string;
      exp?: number;
    };
    if (!data.email || !data.exp || data.exp < Date.now()) return null;
    return data.email.toLowerCase().trim();
  } catch {
    return null;
  }
}

export async function setOtpCookie(email: string, hash: string): Promise<void> {
  const jar = await cookies();
  const payload = Buffer.from(
    JSON.stringify({ email, hash, exp: Date.now() + 10 * 60 * 1000 }),
  ).toString("base64url");
  jar.set(OTP_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
}

export async function consumeOtpCookie(
  email: string,
  code: string,
): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(OTP_COOKIE)?.value;
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: string;
      hash?: string;
      exp?: number;
    };
    jar.delete(OTP_COOKIE);
    if (!data.email || !data.hash || !data.exp || data.exp < Date.now()) return false;
    if (data.email !== email) return false;
    return otpMatches(email, code, data.hash);
  } catch {
    return false;
  }
}

export async function setSessionCookie(email: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, encodeSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function readSessionEmail(): Promise<string | null> {
  const jar = await cookies();
  return decodeSession(jar.get(COOKIE)?.value);
}
