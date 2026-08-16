import { describe, expect, it } from "vitest";
import { GRADE12_WAJIB, PILIHAN_SUBJECTS, isPlayableSubject } from "@/data/tka/catalog";
import { GRADE12_KIMIA_QUESTIONS } from "@/data/tka/kimia-questions";
import { GRADE12_MATH_QUESTIONS } from "@/data/tka/questions";
import { TRYOUT_PACKS } from "@/data/tka/tryouts";
import { questionById } from "@/data/tka/bank";

describe("tka catalog", () => {
  it("lists 19 electives with matematika and kimia playable", () => {
    expect(PILIHAN_SUBJECTS).toHaveLength(19);
    expect(PILIHAN_SUBJECTS.filter((s) => s.playable).map((s) => s.id)).toEqual([
      "kimia",
    ]);
    expect(GRADE12_WAJIB.filter((s) => s.playable).map((s) => s.id)).toEqual([
      "matematika",
    ]);
    expect(isPlayableSubject("12", "matematika")).toBe(true);
    expect(isPlayableSubject("12", "kimia")).toBe(true);
    expect(isPlayableSubject("6", "matematika")).toBe(false);
  });

  it("has unique question ids and complete math + kimia packs", () => {
    const ids = [
      ...GRADE12_MATH_QUESTIONS.map((q) => q.id),
      ...GRADE12_KIMIA_QUESTIONS.map((q) => q.id),
    ];
    expect(new Set(ids).size).toBe(ids.length);
    for (const packId of [
      "g12-math-official-1",
      "g12-kimia-official-2025",
      "g12-kimia-latihan-2025",
    ]) {
      const pack = TRYOUT_PACKS.find((p) => p.id === packId);
      expect(pack?.comingSoon).toBeFalsy();
      expect(pack?.questionIds.length).toBeGreaterThan(10);
      for (const id of pack?.questionIds ?? []) {
        expect(questionById(id)).toBeTruthy();
      }
    }
  });
});
