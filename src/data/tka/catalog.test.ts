import { describe, expect, it } from "vitest";
import { GRADE12_WAJIB, PILIHAN_SUBJECTS, isPlayableSubject } from "@/data/tka/catalog";
import { GRADE12_MATH_QUESTIONS } from "@/data/tka/questions";
import { TRYOUT_PACKS } from "@/data/tka/tryouts";
import { questionById } from "@/data/tka/bank";

describe("tka catalog", () => {
  it("lists 19 electives and only matematika playable", () => {
    expect(PILIHAN_SUBJECTS).toHaveLength(19);
    expect(PILIHAN_SUBJECTS.every((s) => !s.playable)).toBe(true);
    expect(GRADE12_WAJIB.filter((s) => s.playable).map((s) => s.id)).toEqual([
      "matematika",
    ]);
    expect(isPlayableSubject("12", "matematika")).toBe(true);
    expect(isPlayableSubject("6", "matematika")).toBe(false);
  });

  it("has unique question ids and a complete official pack", () => {
    const ids = GRADE12_MATH_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    const pack = TRYOUT_PACKS.find((p) => p.id === "g12-math-official-1");
    expect(pack?.comingSoon).toBeFalsy();
    for (const id of pack?.questionIds ?? []) {
      expect(questionById(id)).toBeTruthy();
    }
  });
});
