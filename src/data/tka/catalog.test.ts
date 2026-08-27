import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { GRADE12_WAJIB, PILIHAN_SUBJECTS, isPlayableSubject } from "@/data/tka/catalog";
import { TRYOUT_PACKS } from "@/data/tka/tryouts";
import {
  figureForQuestion,
  passageForQuestion,
  questionById,
  questionsForSubject,
  skillById,
} from "@/data/tka/bank";
import { ALL_TKA_SKILLS } from "@/data/tka/skills";
import { TKA_PAPERS } from "@/data/tka/sources";
import { pickLessonItems } from "@/lib/tka/lessonEngine";

const FIGURE_QUESTION_IDS = [
  "m12-data-01",
  "m12-fungsi-01",
  "m12-trig-01",
  "m12-volume-01",
  "m12-luas-01",
  "m12-geo-01",
  "m12-trans-01",
  "m12-pl-01",
  "k12-l-03",
  "m9-o-04",
  "m9-o-29",
  "en-o-20",
  "m6-b-02",
  "m6-l-03",
  "m6-l-04",
  "m6-l-08",
  "m9-b-02",
  "m9-l-08",
  "m9-l-09",
] as const;

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

  it("files each booklet under one grade and subject", () => {
    const ids = TKA_PAPERS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const pack of TRYOUT_PACKS) {
      if (!pack.paperId) continue;
      const paper = TKA_PAPERS.find((p) => p.id === pack.paperId);
      expect(paper).toBeTruthy();
      expect(paper?.track).toBe(pack.track);
      expect(paper?.subjectId).toBe(pack.subjectId);
    }
  });

  it("keeps every lesson item on that skill, never another topic", () => {
    for (const skill of ALL_TKA_SKILLS) {
      const picked = pickLessonItems(
        skill.id,
        questionsForSubject(skill.subjectId, skill.track ?? "12"),
        () => 0,
      );
      expect(picked.every((q) => q.skillId === skill.id)).toBe(true);
    }
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
        const skill = skillById(q!.skillId);
        expect(skill).toBeTruthy();
        expect(skill?.subjectId).toBe(pack.subjectId);
        expect(skill?.track ?? "12").toBe(pack.track);
      }
    }
  });

  it("prints a graph or table on items that need a figure", () => {
    for (const id of FIGURE_QUESTION_IDS) {
      const q = questionById(id);
      expect(q?.image, id).toBe(`/tka/${id}.svg`);
      const file = join(process.cwd(), "public", "tka", `${id}.svg`);
      expect(existsSync(file), file).toBe(true);
    }
  });

  it("keeps every question image file on disk", () => {
    for (const skill of ALL_TKA_SKILLS) {
      for (const q of questionsForSubject(skill.subjectId, skill.track ?? "12")) {
        if (!q.image) continue;
        const file = join(process.cwd(), "public", q.image.replace(/^\//, ""));
        expect(existsSync(file), `${q.id} → ${file}`).toBe(true);
      }
    }
  });

  it("shows the original TKA 2025 reading passage on official language items", () => {
    const needed: Record<string, string> = {
      "bi-o-01": "buwuhan",
      "bi-o-02": "buwuhan",
      "bi-o-03": "buwuhan",
      "bi-o-05": "layur",
      "bi-o-06": "layur",
      "bi-o-09": "pantai-bersih",
      "bi-o-10": "pantai-bersih",
      "bi-o-11": "sampah-ekosistem",
      "bi-o-12": "sampah-ekosistem",
      "bi-o-13": "sampah-ekosistem",
      "bi-o-14": "ekonomi-global",
      "bi-o-17": "tari-hudoq",
      "bi-o-21": "roh-meratus",
      "bi-o-24": "roh-meratus",
      "bi-o-25": "belis",
      "bi-o-28": "belis",
      "en-o-01": "lion-mouse",
      "en-o-02": "lion-mouse",
      "en-o-03": "lion-mouse",
      "en-o-09": "study-tips",
      "en-o-10": "study-tips",
      "en-o-11": "great-barrier-reef",
      "en-o-15": "great-barrier-reef",
      "en-o-16a": "teen-money",
      "en-o-20": "teen-money",
      "en-o-21": "hera-shero",
      "en-o-25": "hera-shero",
    };
    for (const [id, passageId] of Object.entries(needed)) {
      const q = questionById(id);
      expect(q, id).toBeTruthy();
      const passage = passageForQuestion(q!);
      expect(passage?.id, id).toBe(passageId);
      expect(passage?.body.length, passageId).toBeGreaterThan(350);
    }
    expect(passageForQuestion(questionById("bi-o-01")!)?.body).toContain("hajatan");
    expect(passageForQuestion(questionById("en-o-01")!)?.body).toMatch(/chew|net/i);
    expect(figureForQuestion(questionById("en-o-16a")!)).toBe("/tka/en-o-20.svg");
  });

  it("prints the study-tips infographic that the English items ask about", () => {
    const study = questionById("en-o-09");
    expect(study?.image).toBe("/tka/en-study-tips.svg");
    expect(existsSync(join(process.cwd(), "public/tka/en-study-tips.svg"))).toBe(true);
  });
});
