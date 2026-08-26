import { NextResponse } from "next/server";
import { requireAccountEmail } from "@/lib/tka/session";
import { ensureAdminProfile, publicMe } from "@/lib/tka/service";
import { TKA_DONE_COOKIE } from "@/lib/tka/onboardingLock";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const email = await requireAccountEmail(req);
  if (!email) return NextResponse.json({ error: "auth" }, { status: 401 });
  await ensureAdminProfile(email);
  const me = await publicMe(email);
  const res = NextResponse.json(me);
  if (me.profile?.onboardingCompletedAt) {
    res.cookies.set(TKA_DONE_COOKIE, email, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return res;
}
