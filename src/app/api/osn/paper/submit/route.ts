import { NextResponse } from "next/server";
import { loadOsnQuestions } from "@/lib/osn/loadQuestions";
import type { OsnQuestion } from "@/data/osn/types";
import { requireAccountEmail } from "@/lib/tka/session";
import { submitOsnPaper } from "@/lib/tka/service";

async function questionsForPaper(paperId: string, req: Request): Promise<OsnQuestion[]> {
  const disk = loadOsnQuestions(paperId);
  if (disk.length > 0) return disk;
  try {
    const res = await fetch(new URL(`/osn/questions/${paperId}.json`, req.url), {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    return Array.isArray(data) ? (data as OsnQuestion[]) : [];
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  const email = await requireAccountEmail(req);
  if (!email) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as {
    paperId?: string;
    durationSeconds?: number;
    answers?: Record<string, number>;
  } | null;
  if (!body?.paperId || !body.answers) {
    return NextResponse.json({ error: "body" }, { status: 400 });
  }
  const questions = await questionsForPaper(body.paperId, req);
  const result = await submitOsnPaper({
    email,
    paperId: body.paperId,
    durationSeconds: Number(body.durationSeconds) || 0,
    answers: body.answers,
    questions,
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result);
}
