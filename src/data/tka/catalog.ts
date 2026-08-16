import type { TkaTrack } from "@/lib/tka/grade";

export type SubjectGroup = "wajib" | "pilihan";

export type TkaSubject = {
  id: string;
  group: SubjectGroup;
  labelEn: string;
  labelId: string;
  playable: boolean;
};

export type GradeCatalog = {
  track: TkaTrack;
  playable: boolean;
  wajib: TkaSubject[];
  pilihan: TkaSubject[];
};

export const GRADE6_WAJIB: TkaSubject[] = [
  { id: "matematika", group: "wajib", labelEn: "Mathematics", labelId: "Matematika", playable: true },
  {
    id: "bahasa_indonesia",
    group: "wajib",
    labelEn: "Indonesian",
    labelId: "Bahasa Indonesia",
    playable: true,
  },
];

export const GRADE9_WAJIB: TkaSubject[] = [
  { id: "matematika", group: "wajib", labelEn: "Mathematics", labelId: "Matematika", playable: true },
  {
    id: "bahasa_indonesia",
    group: "wajib",
    labelEn: "Indonesian",
    labelId: "Bahasa Indonesia",
    playable: true,
  },
];

export const PILIHAN_SUBJECTS: TkaSubject[] = [
  { id: "fisika", group: "pilihan", labelEn: "Physics", labelId: "Fisika", playable: true },
  { id: "kimia", group: "pilihan", labelEn: "Chemistry", labelId: "Kimia", playable: true },
  { id: "biologi", group: "pilihan", labelEn: "Biology", labelId: "Biologi", playable: true },
  {
    id: "matematika_lanjut",
    group: "pilihan",
    labelEn: "Advanced Mathematics",
    labelId: "Matematika Tingkat Lanjut",
    playable: true,
  },
  { id: "ekonomi", group: "pilihan", labelEn: "Economics", labelId: "Ekonomi", playable: true },
  { id: "sosiologi", group: "pilihan", labelEn: "Sociology", labelId: "Sosiologi", playable: true },
  { id: "geografi", group: "pilihan", labelEn: "Geography", labelId: "Geografi", playable: true },
  { id: "sejarah", group: "pilihan", labelEn: "History", labelId: "Sejarah", playable: true },
  { id: "antropologi", group: "pilihan", labelEn: "Anthropology", labelId: "Antropologi", playable: false },
  {
    id: "ppkn",
    group: "pilihan",
    labelEn: "Pancasila and Civics (PPKn)",
    labelId: "Pendidikan Pancasila dan Kewarganegaraan (PPKn)",
    playable: true,
  },
  {
    id: "bahasa_indonesia_lanjut",
    group: "pilihan",
    labelEn: "Advanced Indonesian",
    labelId: "Bahasa Indonesia Tingkat Lanjut",
    playable: false,
  },
  {
    id: "bahasa_inggris_lanjut",
    group: "pilihan",
    labelEn: "Advanced English",
    labelId: "Bahasa Inggris Tingkat Lanjut",
    playable: false,
  },
  { id: "bahasa_arab", group: "pilihan", labelEn: "Arabic", labelId: "Bahasa Arab", playable: false },
  { id: "bahasa_mandarin", group: "pilihan", labelEn: "Mandarin", labelId: "Bahasa Mandarin", playable: false },
  { id: "bahasa_jepang", group: "pilihan", labelEn: "Japanese", labelId: "Bahasa Jepang", playable: false },
  { id: "bahasa_korea", group: "pilihan", labelEn: "Korean", labelId: "Bahasa Korea", playable: false },
  { id: "bahasa_jerman", group: "pilihan", labelEn: "German", labelId: "Bahasa Jerman", playable: false },
  { id: "bahasa_prancis", group: "pilihan", labelEn: "French", labelId: "Bahasa Prancis", playable: false },
  { id: "informatika", group: "pilihan", labelEn: "Informatics", labelId: "Informatika", playable: false },
];

export const GRADE12_WAJIB: TkaSubject[] = [
  { id: "matematika", group: "wajib", labelEn: "Mathematics", labelId: "Matematika", playable: true },
  {
    id: "bahasa_indonesia",
    group: "wajib",
    labelEn: "Indonesian",
    labelId: "Bahasa Indonesia",
    playable: true,
  },
  { id: "bahasa_inggris", group: "wajib", labelEn: "English", labelId: "Bahasa Inggris", playable: true },
];

export const CATALOG: Record<TkaTrack, GradeCatalog> = {
  "6": { track: "6", playable: true, wajib: GRADE6_WAJIB, pilihan: [] },
  "9": { track: "9", playable: true, wajib: GRADE9_WAJIB, pilihan: [] },
  "12": {
    track: "12",
    playable: true,
    wajib: GRADE12_WAJIB,
    pilihan: PILIHAN_SUBJECTS,
  },
};

export function subjectById(id: string): TkaSubject | undefined {
  return [...GRADE6_WAJIB, ...GRADE9_WAJIB, ...GRADE12_WAJIB, ...PILIHAN_SUBJECTS].find(
    (s) => s.id === id,
  );
}

export function isPlayableSubject(track: TkaTrack, subjectId: string): boolean {
  const cat = CATALOG[track];
  if (!cat.playable) return false;
  const subject = [...cat.wajib, ...cat.pilihan].find((s) => s.id === subjectId);
  return Boolean(subject?.playable);
}

export const PILIHAN_IDS = PILIHAN_SUBJECTS.map((s) => s.id);

export function isPilihanId(id: string): boolean {
  return PILIHAN_IDS.includes(id);
}
