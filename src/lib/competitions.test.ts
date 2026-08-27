import { describe, expect, it } from "vitest";
import type { Competition } from "@/types";
import curatedJson from "@/data/competitions.json";
import {
  filterAndSortCompetitions,
  mergeCompetitionCatalogs,
} from "./competitions";

const curated = (curatedJson as { competitions: Competition[] }).competitions;

function sample(partial: Partial<Competition> & Pick<Competition, "id" | "name">): Competition {
  return {
    scope: "indonesia",
    field: "arts",
    level: "both",
    registrationDeadline: "2026-12-01",
    description: "Test listing.",
    url: "https://example.edu/",
    ...partial,
  };
}

describe("curated niche catalog", () => {
  it("lists at least 50 competitions students can browse", () => {
    expect(curated.length).toBeGreaterThanOrEqual(50);
  });

  it("includes Festival Film Indonesia registration", () => {
    const ffi = curated.find((c) => c.id === "ffi-2026-film");
    expect(ffi?.name).toMatch(/Festival Film Indonesia/i);
    expect(ffi?.url).toContain("festivalfilm.id");
    expect(ffi?.registrationDeadline).toBe("2026-08-31");
    expect(ffi?.field).toBe("arts");
  });

  it("gives every listing a deadline, field, and official link", () => {
    for (const c of curated) {
      expect(c.id).toBeTruthy();
      expect(c.name.length).toBeGreaterThan(3);
      expect(c.registrationDeadline).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(["stem", "humanities", "business", "arts", "language", "multidisciplinary"]).toContain(
        c.field,
      );
      const href = c.url ?? c.links?.[0]?.url;
      expect(href).toMatch(/^https?:\/\//);
    }
    const ids = curated.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("mergeCompetitionCatalogs", () => {
  it("keeps niche listings next to the official calendar", () => {
    const merged = mergeCompetitionCatalogs(
      [sample({ id: "puspresnas-1", name: "OSN 2026 (SMA)", field: "stem" })],
      [sample({ id: "ffi-2026-film", name: "Festival Film Indonesia 2026" })],
    );
    expect(merged.map((c) => c.id).sort()).toEqual(["ffi-2026-film", "puspresnas-1"]);
  });

  it("lets the live Puspresnas card win when ids collide", () => {
    const merged = mergeCompetitionCatalogs(
      [sample({ id: "shared", name: "Live OSN", field: "stem" })],
      [sample({ id: "shared", name: "Stale OSN", field: "stem" })],
    );
    expect(merged).toHaveLength(1);
    expect(merged[0]?.name).toBe("Live OSN");
  });
});

describe("filterAndSortCompetitions", () => {
  it("can show the full catalog, with open registrations first", () => {
    const now = new Date("2026-08-27T00:00:00+07:00");
    const list = filterAndSortCompetitions(
      [
        sample({ id: "closed", name: "Closed", registrationDeadline: "2026-08-01" }),
        sample({ id: "open", name: "Open", registrationDeadline: "2026-09-01" }),
      ],
      { query: "", field: "all", scope: "all", openOnly: false },
      now,
    );
    expect(list.map((c) => c.id)).toEqual(["open", "closed"]);
  });
});
