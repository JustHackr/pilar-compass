import { describe, expect, it } from "vitest";
import { GRADE12_WAJIB, PILIHAN_SUBJECTS, isPlayableSubject } from "@/data/tka/catalog";
import { TRYOUT_PACKS } from "@/data/tka/tryouts";
import { questionById, skillById } from "@/data/tka/bank";
import { ALL_TKA_SKILLS } from "@/data/tka/skills";

describe("tka catalog", () => {
  it("opens grade 6 and 9 language/math plus grade 12 wajib and eight electives", () => {
    expect(PILIHAN_SUBJECTS).toHaveLength(19);
    expect(PILIHAN_SUBJECTS.filter((s) => s.playable).map((s) => s.id)).toEqual([
      "fisika",
      "kimia",
      "biologi",
      "matematika_lanjut",
      "ekonomi",
      "sosiologi",
      "geografi",
      "sejarah",
      "ppkn",
    ]);
    expect(GRADE12_WAJIB.filter((s) => s.playable).map((s) => s.id)).toEqual([
      "matematika",
      "bahasa_indonesia",
      "bahasa_inggris",
    ]);
    expect(isPlayableSubject("12", "matematika")).toBe(true);
    expect(isPlayableSubject("12", "fisika")).toBe(true);
    expect(isPlayableSubject("9", "matematika")).toBe(true);
    expect(isPlayableSubject("9", "bahasa_indonesia")).toBe(true);
    expect(isPlayableSubject("6", "matematika")).toBe(true);
    expect(isPlayableSubject("6", "bahasa_indonesia")).toBe(true);
  });

  it("has unique skill ids and every tryout item exists", () => {
    const skillIds = ALL_TKA_SKILLS.map((s) => s.id);
    expect(new Set(skillIds).size).toBe(skillIds.length);
    const live = TRYOUT_PACKS.filter((p) => !p.comingSoon);
    expect(live.length).toBeGreaterThan(10);
    for (const pack of live) {
      expect(pack.questionIds.length).toBeGreaterThan(10);
      for (const id of pack.questionIds) {
        const q = questionById(id);
        expect(q).toBeTruthy();
        expect(skillById(q!.skillId)).toBeTruthy();
      }
    }
  });
});
