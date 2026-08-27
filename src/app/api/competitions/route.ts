import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";
import type { Competition } from "@/types";
import { mergeCompetitionCatalogs } from "@/lib/competitions";
import { loadPuspresnasCompetitions } from "@/lib/puspresnas";

export const runtime = "nodejs";
export const revalidate = 21600;

type CatalogPayload = {
  competitions: Competition[];
  fetchedAt: string;
  live: boolean;
};

let officialCache: CatalogPayload | null = null;

function loadCuratedFromDisk(): Competition[] {
  const raw = readFileSync(join(process.cwd(), "data/competitions.json"), "utf8");
  const parsed = JSON.parse(raw) as { competitions?: Competition[] };
  return Array.isArray(parsed.competitions) ? parsed.competitions : [];
}

function payload(official: CatalogPayload, curated: Competition[]) {
  return {
    source: official.live ? "puspresnas+curated" : "curated",
    live: official.live,
    fetchedAt: official.fetchedAt,
    competitions: mergeCompetitionCatalogs(official.competitions, curated),
  };
}

export async function GET() {
  const curated = loadCuratedFromDisk();
  if (officialCache) {
    return NextResponse.json(payload(officialCache, curated));
  }
  try {
    const loaded = await loadPuspresnasCompetitions();
    officialCache = loaded;
    return NextResponse.json(payload(loaded, curated));
  } catch (err) {
    console.error("competitions catalog failed", err);
    return NextResponse.json({
      source: "curated",
      live: false,
      fetchedAt: new Date().toISOString(),
      competitions: curated,
    });
  }
}
