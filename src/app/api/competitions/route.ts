import { NextResponse } from "next/server";
import { loadPuspresnasCompetitions } from "@/lib/puspresnas";

export const runtime = "nodejs";
export const revalidate = 21600;

export async function GET() {
  const { competitions, fetchedAt, live } = await loadPuspresnasCompetitions();
  return NextResponse.json({
    source: "puspresnas",
    live,
    fetchedAt,
    competitions,
  });
}
