import { NextResponse } from "next/server";
import { readSessionEmail } from "@/lib/tka/session";
import { publicMe } from "@/lib/tka/service";

export async function GET() {
  const email = await readSessionEmail();
  if (!email) return NextResponse.json({ error: "auth" }, { status: 401 });
  return NextResponse.json(await publicMe(email));
}
