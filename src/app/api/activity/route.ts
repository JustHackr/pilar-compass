import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/session";
import { claimedEmailFrom } from "@/lib/tka/session";
import { logActivity } from "@/lib/tka/service";

const TYPE_RE = /^[a-z0-9_]{2,40}$/;

export async function POST(req: Request) {
  const email = claimedEmailFrom(req);
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "email" }, { status: 400 });
  }
  const body = (await req.json().catch(() => null)) as {
    type?: string;
    path?: string;
    detail?: string;
  } | null;
  const type = (body?.type ?? "page_view").toLowerCase();
  if (!TYPE_RE.test(type)) {
    return NextResponse.json({ error: "type" }, { status: 400 });
  }
  await logActivity({
    email,
    type,
    path: typeof body?.path === "string" ? body.path.slice(0, 200) : undefined,
    detail: typeof body?.detail === "string" ? body.detail.slice(0, 240) : undefined,
  });
  return NextResponse.json({ ok: true });
}
