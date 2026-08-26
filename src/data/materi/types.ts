export const MATERI_GRADES = [4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type MateriGrade = (typeof MATERI_GRADES)[number];
export type MateriCurriculum = "merdeka" | "k13";
export type MateriRole = "siswa" | "guru";
export type MateriStream = "umum" | "smk";

export type MateriSubject = {
  id: string;
  labelEn: string;
  labelId: string;
};

export type MateriBook = {
  id: string;
  slug: string;
  title: string;
  grade: MateriGrade;
  subjectId: string;
  curriculum: MateriCurriculum;
  role: MateriRole;
  stream: MateriStream;
  level: string;
  writer: string;
  isbn: string;
  year: number | null;
  coverUrl: string;
  pdfUrl: string;
  detailUrl: string;
};

export const SIBI_HOME = "https://buku.kemendikdasmen.go.id/";
export const SIBI_MERDEKA = "https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka";
export const SIBI_K13 = "https://buku.kemendikdasmen.go.id/katalog/buku-teks-k13";

export function isMateriGrade(value: string | number): value is MateriGrade {
  const n = typeof value === "number" ? value : Number(value);
  return (MATERI_GRADES as readonly number[]).includes(n);
}

export function materiGradeTrack(grade: MateriGrade): "6" | "9" | "12" {
  if (grade <= 6) return "6";
  if (grade <= 9) return "9";
  return "12";
}
