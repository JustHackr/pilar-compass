import { NextResponse } from "next/server";
import { readSessionEmail } from "@/lib/tka/session";
import { submitTryout } from "@/lib/tka/service";
import type { LessonCheck } from "@/lib/tka/scoring";

export async function POST(req: Request) {
  const email = await readSessionEmail();
  if (!email) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as {
    packId?: string;
    durationSeconds?: number;
    answers?: Record<string, LessonCheck>;
  } | null;
  if (!body?.packId || !body.answers) {
    return NextResponse.json({ error: "body" }, { status: 400 });
  }
  const result = await submitTryout({
    email,
    packId: body.packId,
    durationSeconds: Number(body.durationSeconds) || 0,
    answers: body.answers,
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result);
}
