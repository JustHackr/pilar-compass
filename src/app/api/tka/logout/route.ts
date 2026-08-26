import { NextResponse } from "next/server";
import { claimedEmailFrom } from "@/lib/tka/session";
import { logActivity } from "@/lib/tka/service";

export async function POST(req: Request) {
  const email = claimedEmailFrom(req);
  if (email) {
    await logActivity({ email, type: "logout", detail: "Signed out" });
  }
  return NextResponse.json({ ok: true });
}
