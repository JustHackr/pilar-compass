import { NextResponse } from "next/server";
import { readSessionEmail } from "@/lib/tka/session";
import { completeLesson } from "@/lib/tka/service";
import type { ItemOutcome } from "@/lib/tka/scoring";

export async function POST(req: Request) {
  const email = await readSessionEmail();
  if (!email) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as {
    skillId?: string;
    xp?: number;
    outcomes?: Record<string, ItemOutcome>;
  } | null;
  if (!body?.skillId || !body.outcomes) {
    return NextResponse.json({ error: "body" }, { status: 400 });
  }
  const result = await completeLesson({
    email,
    skillId: body.skillId,
    xp: Number(body.xp) || 0,
    outcomes: body.outcomes,
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result);
}
