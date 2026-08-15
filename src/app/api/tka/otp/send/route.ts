import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/session";
import { emailKey, issueOtp } from "@/lib/tka/service";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: string } | null;
  const email = emailKey(body?.email ?? "");
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "email" }, { status: 400 });
  }
  const code = await issueOtp(email);
  const reveal = process.env.TKA_HIDE_OTP !== "1";
  return NextResponse.json({
    ok: true,
    ...(reveal ? { devCode: code } : {}),
  });
}
