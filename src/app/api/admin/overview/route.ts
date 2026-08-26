import { NextResponse } from "next/server";
import { isAdminEmail } from "@/data/spi-classes";
import { buildAdminOverview } from "@/lib/tka/admin";
import { requireAccountEmail } from "@/lib/tka/session";
import { readStore } from "@/lib/tka/store";

export async function GET(req: Request) {
  const email = await requireAccountEmail(req);
  if (!email) return NextResponse.json({ error: "auth" }, { status: 401 });
  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await readStore();
  return NextResponse.json(buildAdminOverview(db));
}
