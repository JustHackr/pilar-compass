import type { Competition, CompetitionField, CompetitionLevel } from "@/types";
import fallbackJson from "@/data/puspresnas-fallback.json";
import { fetchPuspresnasHtml } from "@/lib/kemendikdasmen-fetch";

export const PUSPRESNAS_HOME = "https://pusatprestasinasional.kemendikdasmen.go.id";
export const PUSPRESNAS_REGISTER = "https://daftar-bpti.kemendikdasmen.go.id/";
export const ACADEMIC_CATEGORIES = ["riset-dan-inovasi", "seni-budaya"] as const;
export const SPI_JENJANG = new Set(["smp", "sma", "smk"]);

const UA = "PilarCompass/1.0 (SPI student competitions; +https://pilar.sch.id)";

export type PuspresnasRawEvent = {
  id: number;
  nama_event?: string;
  nama_singkat?: string;
  slug?: string;
  detail_singkat?: string;
  link?: string;
  start?: string;
  end?: string;
  route?: string;
  category?: { slug?: string; title?: string };
};

type FallbackFile = {
  fetchedAt: string;
  events: PuspresnasRawEvent[];
};

const fallback = fallbackJson as FallbackFile;

export function decodeInertiaPageJson(html: string): unknown {
  const match = html.match(/data-page="([^"]+)"/);
  if (!match?.[1]) throw new Error("Puspresnas page is missing event data");
  const decoded = match[1]
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
  return JSON.parse(decoded) as unknown;
}

export function eventsFromInertiaPage(html: string): PuspresnasRawEvent[] {
  const page = decodeInertiaPageJson(html) as {
    props?: { data?: { event?: PuspresnasRawEvent[] } };
  };
  const events = page.props?.data?.event;
  return Array.isArray(events) ? events : [];
}

export function jenjangFromEvent(event: PuspresnasRawEvent): string | null {
  const hay = `${event.route ?? ""} ${event.slug ?? ""}`.toLowerCase();
  const fromRoute = hay.match(/\/event\/[^/]+\/(sd|smp|sma|smk|diksus)\//);
  if (fromRoute) return fromRoute[1];
  const fromSlug = hay.match(/-(sd|smp|sma|smk|diksus)$/);
  return fromSlug ? fromSlug[1] : null;
}

export function fieldFromEvent(event: PuspresnasRawEvent): CompetitionField {
  const cat = (event.category?.slug ?? "").toLowerCase();
  const name = `${event.nama_singkat ?? ""} ${event.nama_event ?? ""}`.toLowerCase();
  if (cat === "seni-budaya") {
    if (/debat|\bldi\b/.test(name)) return "language";
    return "arts";
  }
  if (/fiksi|kewirausahaan/.test(name)) return "business";
  return "stem";
}

export function levelFromJenjang(jenjang: string): CompetitionLevel {
  return jenjang === "smp" ? "junior" : "senior";
}

export function yearFromEvent(event: PuspresnasRawEvent): number | null {
  const hay = `${event.slug ?? ""} ${event.nama_event ?? ""} ${event.start ?? ""}`;
  const match = hay.match(/\b(20\d{2})\b/);
  return match ? Number(match[1]) : null;
}

export function isCurrentAcademicEvent(event: PuspresnasRawEvent, now = new Date()): boolean {
  const jenjang = jenjangFromEvent(event);
  if (!jenjang || !SPI_JENJANG.has(jenjang)) return false;
  const year = yearFromEvent(event);
  const end = event.end ?? "";
  const today = toIsoDate(now);
  if (end && end >= today) return true;
  return year != null && year >= now.getFullYear();
}

function toIsoDate(now: Date): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function compactText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function competitionFromEvent(event: PuspresnasRawEvent): Competition | null {
  const jenjang = jenjangFromEvent(event);
  if (!jenjang || !SPI_JENJANG.has(jenjang)) return null;
  const name = compactText(event.nama_event || event.nama_singkat || "");
  const deadline = event.end || event.start;
  if (!name || !deadline) return null;
  const short = compactText(event.nama_singkat || name);
  const detail = compactText(event.detail_singkat || "");
  const official = event.route || `${PUSPRESNAS_HOME}/`;
  const register = event.link || PUSPRESNAS_REGISTER;
  const jenjangLabel = jenjang.toUpperCase();
  const titled =
    new RegExp(`\\b${jenjangLabel}\\b`, "i").test(name) || /smp|sma|smk|junior|senior/i.test(name)
      ? name
      : `${name} (${jenjangLabel})`;
  return {
    id: `puspresnas-${event.id}`,
    name: titled,
    scope: "indonesia",
    field: fieldFromEvent(event),
    level: levelFromJenjang(jenjang),
    registrationDeadline: deadline,
    eventStart: event.start || undefined,
    description:
      detail ||
      `Official Puspresnas ajang talenta (${short}) for ${jenjang.toUpperCase()}. Register via BPTI.`,
    url: official,
    links: [
      { label: "Puspresnas page", url: official, kind: "post" },
      { label: "Register on BPTI", url: register, kind: "register" },
      { label: "Puspresnas", url: PUSPRESNAS_HOME, kind: "website" },
    ],
    tags: ["puspresnas", jenjang, short.toLowerCase().replace(/\s+/g, "-")].filter(Boolean),
  };
}

export function competitionsFromEvents(
  events: PuspresnasRawEvent[],
  now = new Date(),
): Competition[] {
  const mapped = events
    .filter((e) => isCurrentAcademicEvent(e, now))
    .map(competitionFromEvent)
    .filter((c): c is Competition => c != null);
  const byId = new Map<string, Competition>();
  for (const c of mapped) byId.set(c.id, c);
  return [...byId.values()].sort((a, b) => a.registrationDeadline.localeCompare(b.registrationDeadline));
}

async function fetchCategoryHtml(slug: string): Promise<string> {
  return fetchPuspresnasHtml(`${PUSPRESNAS_HOME}/event/${slug}`, UA);
}

export async function fetchPuspresnasEvents(): Promise<PuspresnasRawEvent[]> {
  const pages = await Promise.all(ACADEMIC_CATEGORIES.map((slug) => fetchCategoryHtml(slug)));
  return pages.flatMap(eventsFromInertiaPage);
}

export async function loadPuspresnasCompetitions(now = new Date()): Promise<{
  competitions: Competition[];
  fetchedAt: string;
  live: boolean;
}> {
  try {
    const events = await fetchPuspresnasEvents();
    return {
      competitions: competitionsFromEvents(events, now),
      fetchedAt: new Date().toISOString(),
      live: true,
    };
  } catch (err) {
    console.error("Puspresnas calendar refresh failed", err);
    return {
      competitions: competitionsFromEvents(fallback.events, now),
      fetchedAt: fallback.fetchedAt,
      live: false,
    };
  }
}
