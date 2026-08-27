import { NextResponse } from "next/server";
import { requireAccountEmail } from "@/lib/tka/session";
import { restoreStudentSnapshot } from "@/lib/tka/service";
import type { TkaPublicMe } from "@/lib/tka/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const email = await requireAccountEmail(req);
  if (!email) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as TkaPublicMe | null;
  if (!body?.email) return NextResponse.json({ error: "body" }, { status: 400 });
  await restoreStudentSnapshot(email, body);
  return NextResponse.json({ ok: true });
}
