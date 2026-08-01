import type { Competition } from "@/types";

export function todayISODate(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isRegistrationOpen(
  competition: Competition,
  now = new Date(),
): boolean {
  return competition.registrationDeadline >= todayISODate(now);
}

export function daysUntilDeadline(
  competition: Competition,
  now = new Date(),
): number {
  const today = todayISODate(now);
  const t0 = Date.parse(`${today}T00:00:00`);
  const t1 = Date.parse(`${competition.registrationDeadline}T00:00:00`);
  return Math.round((t1 - t0) / 86_400_000);
}

export type CompetitionFilters = {
  query: string;
  field: Competition["field"] | "all";
  scope: Competition["scope"] | "all";
  openOnly: boolean;
};

export function filterAndSortCompetitions(
  competitions: Competition[],
  filters: CompetitionFilters,
  now = new Date(),
): Competition[] {
  const q = filters.query.trim().toLowerCase();

  const filtered = competitions.filter((c) => {
    if (filters.openOnly && !isRegistrationOpen(c, now)) return false;
    if (filters.field !== "all" && c.field !== filters.field) return false;
    if (filters.scope !== "all" && c.scope !== filters.scope) return false;
    if (!q) return true;
    const hay = `${c.name} ${c.description} ${(c.tags ?? []).join(" ")}`.toLowerCase();
    return hay.includes(q);
  });

  return filtered.sort((a, b) => {
    const aOpen = isRegistrationOpen(a, now);
    const bOpen = isRegistrationOpen(b, now);
    if (aOpen !== bOpen) return aOpen ? -1 : 1;
    return a.registrationDeadline.localeCompare(b.registrationDeadline);
  });
}

export const FIELD_LABELS: Record<Competition["field"] | "all", string> = {
  all: "All fields",
  stem: "STEM",
  humanities: "Humanities",
  business: "Business",
  arts: "Arts",
  language: "Language",
  multidisciplinary: "Multidisciplinary",
};

export const SCOPE_LABELS: Record<Competition["scope"] | "all", string> = {
  all: "All regions",
  indonesia: "Indonesia",
  international: "International",
};
