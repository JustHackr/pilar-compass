import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/session";
import { setSessionCookie } from "@/lib/tka/session";
import { consumeOtp, emailKey } from "@/lib/tka/service";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    email?: string;
    code?: string;
  } | null;
  const email = emailKey(body?.email ?? "");
  const code = body?.code ?? "";
  if (!isValidEmail(email) || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const ok = await consumeOtp(email, code);
  if (!ok) return NextResponse.json({ error: "code" }, { status: 401 });
  await setSessionCookie(email);
  return NextResponse.json({ ok: true });
}
