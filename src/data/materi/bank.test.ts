import { describe, expect, it } from "vitest";
import {
  MATERI_BOOKS,
  MATERI_GRADES,
  MATERI_SUBJECTS,
  bookCountForGrade,
  booksForSubject,
  gradesVisibleFor,
  subjectsForGrade,
} from "./bank";

describe("materi catalog", () => {
  it("covers grades 4–12 with official PDF links", () => {
    expect(MATERI_GRADES).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(MATERI_BOOKS.length).toBeGreaterThan(700);
    expect(MATERI_SUBJECTS.length).toBeGreaterThan(20);
    expect(MATERI_BOOKS.every((b) => b.pdfUrl.startsWith("https://"))).toBe(true);
    expect(new Set(MATERI_BOOKS.map((b) => b.grade))).toEqual(new Set(MATERI_GRADES));
  });

  it("includes Kurikulum Merdeka and K13 textbooks", () => {
    const curr = new Set(MATERI_BOOKS.map((b) => b.curriculum));
    expect(curr).toEqual(new Set(["merdeka", "k13"]));
  });

  it("lists grade 4 subjects and mathematics books", () => {
    const subjects = subjectsForGrade(4).map((s) => s.id);
    expect(subjects).toContain("matematika");
    expect(subjects).toContain("tematik");
    expect(bookCountForGrade(4)).toBeGreaterThan(20);
    expect(booksForSubject(4, "matematika").length).toBeGreaterThan(0);
  });

  it("does not tag teacher-guide titles as student books", () => {
    const mislabeled = MATERI_BOOKS.filter(
      (b) =>
        b.role === "siswa" &&
        /panduan guru|buku guru/i.test(b.title),
    );
    expect(mislabeled).toEqual([]);
  });

  it("lets a grade-12 track see every materi grade", () => {
    expect(gradesVisibleFor("12")).toEqual([...MATERI_GRADES]);
    expect(gradesVisibleFor("6")).toEqual([4, 5, 6]);
    expect(gradesVisibleFor("9")).toEqual([4, 5, 6, 7, 8, 9]);
  });
});
