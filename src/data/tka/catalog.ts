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

export const PILIHAN_SUBJECTS: TkaSubject[] = [
  { id: "fisika", group: "pilihan", labelEn: "Physics", labelId: "Fisika", playable: false },
  { id: "kimia", group: "pilihan", labelEn: "Chemistry", labelId: "Kimia", playable: false },
  { id: "biologi", group: "pilihan", labelEn: "Biology", labelId: "Biologi", playable: false },
  {
    id: "matematika_lanjut",
    group: "pilihan",
    labelEn: "Advanced Mathematics",
    labelId: "Matematika Tingkat Lanjut",
    playable: false,
  },
  { id: "ekonomi", group: "pilihan", labelEn: "Economics", labelId: "Ekonomi", playable: false },
  { id: "sosiologi", group: "pilihan", labelEn: "Sociology", labelId: "Sosiologi", playable: false },
  { id: "geografi", group: "pilihan", labelEn: "Geography", labelId: "Geografi", playable: false },
  { id: "sejarah", group: "pilihan", labelEn: "History", labelId: "Sejarah", playable: false },
  { id: "antropologi", group: "pilihan", labelEn: "Anthropology", labelId: "Antropologi", playable: false },
  {
    id: "ppkn",
    group: "pilihan",
    labelEn: "Pancasila and Civics (PPKn)",
    labelId: "Pendidikan Pancasila dan Kewarganegaraan (PPKn)",
    playable: false,
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
    playable: false,
  },
  { id: "bahasa_inggris", group: "wajib", labelEn: "English", labelId: "Bahasa Inggris", playable: false },
];

export const CATALOG: Record<TkaTrack, GradeCatalog> = {
  "6": { track: "6", playable: false, wajib: [], pilihan: [] },
  "9": { track: "9", playable: false, wajib: [], pilihan: [] },
  "12": {
    track: "12",
    playable: true,
    wajib: GRADE12_WAJIB,
    pilihan: PILIHAN_SUBJECTS,
  },
};

export function subjectById(id: string): TkaSubject | undefined {
  return [...GRADE12_WAJIB, ...PILIHAN_SUBJECTS].find((s) => s.id === id);
}

export function isPlayableSubject(track: TkaTrack, subjectId: string): boolean {
  if (track !== "12") return false;
  return GRADE12_WAJIB.some((s) => s.id === subjectId && s.playable);
}

export const PILIHAN_IDS = PILIHAN_SUBJECTS.map((s) => s.id);

export function isPilihanId(id: string): boolean {
  return PILIHAN_IDS.includes(id);
}
