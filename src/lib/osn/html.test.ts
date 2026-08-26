import { describe, expect, it } from "vitest";
import { parseOsnChoices, parseOsnMeta, sanitizeOsnHtml, sortPapersByYear } from "./html";

describe("osn meta", () => {
  it("reads year, stage, and format from archive titles", () => {
    expect(parseOsnMeta("OSP Kimia 2019 (Pilgan)")).toEqual({
      year: 2019,
      stage: "osp",
      format: "pilgan",
    });
    expect(parseOsnMeta("OSK Matematika SMP 2014 (Essay)")).toEqual({
      year: 2014,
      stage: "osk",
      format: "essay",
    });
    expect(parseOsnMeta("KSN-K IPA 2021")).toEqual({
      year: 2021,
      stage: "osk",
      format: "mixed",
    });
  });

  it("sorts newest year first and keeps undated last among zeros", () => {
    const sorted = sortPapersByYear([
      { year: 2014, title: "A" },
      { year: 2019, title: "B" },
      { year: null, title: "C" },
      { year: 2019, title: "A-same-year" },
    ]);
    expect(sorted.map((p) => p.title)).toEqual(["A-same-year", "B", "A", "C"]);
  });

  it("strips scripts from question HTML", () => {
    expect(sanitizeOsnHtml(`<p>Hi</p><script>alert(1)</script>`)).toBe("<p>Hi</p>");
  });

  it("splits br-separated A–E choices in one paragraph", () => {
    const html =
      "<p>Perbedaan utama adalah<br /> A. Lensa<br /> B. Cermin<br /> C. Cembung<br /> D. Objek<br /> E. Membuat cermin</p>";
    const parsed = parseOsnChoices(html);
    expect(parsed?.choices).toEqual(["Lensa", "Cermin", "Cembung", "Objek", "Membuat cermin"]);
    expect(parsed?.stemHtml).toContain("Perbedaan utama");
  });
});
