import { NextResponse } from "next/server";
import { readSessionEmail } from "@/lib/tka/session";
import { getProfile, leaderboard } from "@/lib/tka/service";

export async function GET(req: Request) {
  const email = await readSessionEmail();
  if (!email) return NextResponse.json({ error: "auth" }, { status: 401 });
  const url = new URL(req.url);
  const scope = url.searchParams.get("scope") === "class" ? "class" : "school";
  const me = await getProfile(email);
  const rows = await leaderboard(scope, me?.kelas);
  return NextResponse.json({ scope, kelas: me?.kelas ?? null, rows });
}
