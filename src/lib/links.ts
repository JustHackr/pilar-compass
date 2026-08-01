import type { Competition, CompetitionLink } from "@/types";

/** Normalize legacy `url` + `links` into a single clickable list. */
export function getCompetitionLinks(c: Competition): CompetitionLink[] {
  const links = [...(c.links ?? [])];
  if (c.url && !links.some((l) => l.url === c.url)) {
    links.unshift({ label: "Official website", url: c.url, kind: "website" });
  }
  return links;
}
