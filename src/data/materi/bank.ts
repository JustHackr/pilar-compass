import catalogJson from "@/data/materi/generated/catalog.json";
import type { TkaTrack } from "@/lib/tka/grade";
import { canAccessTrack } from "@/lib/tka/grade";
import {
  MATERI_GRADES,
  materiGradeTrack,
  type MateriBook,
  type MateriCurriculum,
  type MateriGrade,
  type MateriRole,
  type MateriStream,
  type MateriSubject,
} from "./types";

export type { MateriBook, MateriCurriculum, MateriGrade, MateriRole, MateriStream, MateriSubject };
export {
  MATERI_GRADES,
  SIBI_HOME,
  SIBI_K13,
  SIBI_MERDEKA,
  isMateriGrade,
  materiGradeTrack,
} from "./types";

type CatalogFile = {
  scrapedAt: string;
  source: string;
  api: string;
  grades: number[];
  subjects: MateriSubject[];
  books: MateriBook[];
};

const catalog = catalogJson as CatalogFile;

export const MATERI_SCRAPED_AT = catalog.scrapedAt;
export const MATERI_SUBJECTS: MateriSubject[] = catalog.subjects;
export const MATERI_BOOKS: MateriBook[] = catalog.books;

const subjectById = new Map(MATERI_SUBJECTS.map((s) => [s.id, s]));

export function gradesVisibleFor(profileTrack: TkaTrack): MateriGrade[] {
  return MATERI_GRADES.filter((g) => canAccessTrack(profileTrack, materiGradeTrack(g)));
}

export function canAccessMateriGrade(profileTrack: TkaTrack, grade: MateriGrade): boolean {
  return canAccessTrack(profileTrack, materiGradeTrack(grade));
}

export function subjectByIdLookup(id: string): MateriSubject | undefined {
  return subjectById.get(id);
}

export function booksForGrade(grade: MateriGrade): MateriBook[] {
  return MATERI_BOOKS.filter((b) => b.grade === grade);
}

export function subjectsForGrade(grade: MateriGrade): MateriSubject[] {
  const ids = new Set(booksForGrade(grade).map((b) => b.subjectId));
  return MATERI_SUBJECTS.filter((s) => ids.has(s.id));
}

export function bookCountForGrade(grade: MateriGrade, subjectId?: string): number {
  return MATERI_BOOKS.filter(
    (b) => b.grade === grade && (!subjectId || b.subjectId === subjectId),
  ).length;
}

export type MateriBookFilters = {
  curriculum?: MateriCurriculum | "all";
  role?: MateriRole | "all";
  stream?: MateriStream | "all";
};

export function booksForSubject(
  grade: MateriGrade,
  subjectId: string,
  filters?: MateriBookFilters,
): MateriBook[] {
  return MATERI_BOOKS.filter((b) => {
    if (b.grade !== grade || b.subjectId !== subjectId) return false;
    if (filters?.curriculum && filters.curriculum !== "all" && b.curriculum !== filters.curriculum) {
      return false;
    }
    if (filters?.role && filters.role !== "all" && b.role !== filters.role) return false;
    if (filters?.stream && filters.stream !== "all" && b.stream !== filters.stream) return false;
    return true;
  });
}
