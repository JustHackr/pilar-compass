import catalogJson from "@/data/osn/generated/catalog.json";
import { sortPapersByYear } from "@/lib/osn/html";
import type { TkaTrack } from "@/lib/tka/grade";
import { canAccessTrack } from "@/lib/tka/grade";
import type { OsnFormat, OsnLevel, OsnPaper, OsnQuestion, OsnStage, OsnSubject } from "./types";
import { OFFICIAL_BANKS, OSN_LEVELS } from "./types";

export type { OsnFormat, OsnLevel, OsnPaper, OsnQuestion, OsnStage, OsnSubject };
export { ARCHIVE_HOME, OFFICIAL_BANKS, OFFICIAL_HOME, OSN_LEVELS, isOsnLevel } from "./types";

type CatalogFile = {
  scrapedAt: string;
  sources: { archive: string; official: string };
  subjects: OsnSubject[];
  papers: OsnPaper[];
};

const catalog = catalogJson as CatalogFile;

export const OSN_SCRAPED_AT = catalog.scrapedAt;
export const OSN_SUBJECTS: OsnSubject[] = catalog.subjects;
export const OSN_PAPERS: OsnPaper[] = catalog.papers;

export function osnLevelTrack(level: OsnLevel): TkaTrack {
  return OSN_LEVELS.find((l) => l.id === level)?.track ?? "12";
}

export function levelsVisibleFor(profileTrack: TkaTrack) {
  return OSN_LEVELS.filter((l) => canAccessTrack(profileTrack, l.track));
}

export function canAccessOsnLevel(profileTrack: TkaTrack, level: OsnLevel): boolean {
  return canAccessTrack(profileTrack, osnLevelTrack(level));
}

export function subjectsForLevel(level: OsnLevel): OsnSubject[] {
  return OSN_SUBJECTS.filter((s) => s.level === level);
}

export function subjectByIds(level: OsnLevel, subjectId: string): OsnSubject | undefined {
  return OSN_SUBJECTS.find((s) => s.level === level && s.id === subjectId);
}

export function papersForSubject(
  level: OsnLevel,
  subjectId: string,
  filters?: { year?: number | "all"; stage?: OsnStage | "all"; format?: OsnFormat | "all" },
): OsnPaper[] {
  let list = OSN_PAPERS.filter((p) => p.level === level && p.subjectId === subjectId);
  if (filters?.year && filters.year !== "all") {
    list = list.filter((p) => p.year === filters.year);
  }
  if (filters?.stage && filters.stage !== "all") {
    list = list.filter((p) => p.stage === filters.stage);
  }
  if (filters?.format && filters.format !== "all") {
    list = list.filter((p) => p.format === filters.format);
  }
  return sortPapersByYear(list);
}

export function yearsForSubject(level: OsnLevel, subjectId: string): number[] {
  const years = new Set(
    OSN_PAPERS.filter((p) => p.level === level && p.subjectId === subjectId && p.year).map(
      (p) => p.year as number,
    ),
  );
  return [...years].sort((a, b) => b - a);
}

export function paperById(id: string): OsnPaper | undefined {
  return OSN_PAPERS.find((p) => p.id === id);
}

export function officialBanksFor(level?: OsnLevel) {
  return level ? OFFICIAL_BANKS.filter((b) => b.level === level) : OFFICIAL_BANKS;
}

export function paperCountFor(level: OsnLevel, subjectId?: string): number {
  return OSN_PAPERS.filter(
    (p) => p.level === level && (!subjectId || p.subjectId === subjectId),
  ).length;
}
