import { NextResponse } from "next/server";
import { readSessionEmail } from "@/lib/tka/session";
import { saveOnboarding } from "@/lib/tka/service";

export async function POST(req: Request) {
  const email = await readSessionEmail();
  if (!email) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as {
    displayName?: string;
    age?: number;
    tkaTrack?: string;
    kelas?: string;
    pilihanIds?: string[];
  } | null;
  if (!body) return NextResponse.json({ error: "body" }, { status: 400 });
  const result = await saveOnboarding(email, {
    displayName: body.displayName ?? "",
    age: Number(body.age),
    tkaTrack: body.tkaTrack ?? "",
    kelas: body.kelas ?? "",
    pilihanIds: Array.isArray(body.pilihanIds) ? body.pilihanIds : [],
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true, profile: result.profile });
}
