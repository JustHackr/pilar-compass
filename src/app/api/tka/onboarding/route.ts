import { NextResponse } from "next/server";
import { requireAccountEmail } from "@/lib/tka/session";
import { saveOnboarding } from "@/lib/tka/service";
import { TKA_DONE_COOKIE } from "@/lib/tka/onboardingLock";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const email = await requireAccountEmail(req);
  if (!email) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as {
    displayName?: string;
    age?: number;
    tkaTrack?: string;
    kelas?: string;
    pilihanIds?: string[];
    avatarDataUrl?: string | null;
  } | null;
  if (!body) return NextResponse.json({ error: "body" }, { status: 400 });
  const result = await saveOnboarding(email, {
    displayName: body.displayName ?? "",
    age: Number(body.age),
    tkaTrack: body.tkaTrack ?? "",
    kelas: body.kelas ?? "",
    pilihanIds: Array.isArray(body.pilihanIds) ? body.pilihanIds : [],
    ...(Object.prototype.hasOwnProperty.call(body, "avatarDataUrl")
      ? { avatarDataUrl: body.avatarDataUrl ?? null }
      : {}),
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  const res = NextResponse.json({ ok: true, profile: result.profile });
  res.cookies.set(TKA_DONE_COOKIE, email, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}
