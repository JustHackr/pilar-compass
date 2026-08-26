export type OsnLevel = "sd" | "smp" | "sma";
export type OsnStage = "osk" | "osp" | "osn" | "other";
export type OsnFormat = "pilgan" | "essay" | "mixed";

export type OsnSubject = {
  id: string;
  level: OsnLevel;
  paket: string;
  labelEn: string;
  labelId: string;
};

export type OsnPaper = {
  id: string;
  subjectId: string;
  level: OsnLevel;
  paket: string;
  title: string;
  year: number | null;
  stage: OsnStage;
  format: OsnFormat;
  questionCount: number;
  sourceUrl: string;
};

export type OsnQuestion = {
  id: string;
  number: number;
  type: "pilgan" | "essay";
  stemHtml: string;
  choices: string[];
  discussionUrl?: string;
};

export const OSN_LEVELS: { id: OsnLevel; track: "6" | "9" | "12"; labelEn: string; labelId: string }[] = [
  { id: "sd", track: "6", labelEn: "Primary · SD/MI", labelId: "SD/MI" },
  { id: "smp", track: "9", labelEn: "Junior high · SMP/MTs", labelId: "SMP/MTs" },
  { id: "sma", track: "12", labelEn: "Senior high · SMA/MA", labelId: "SMA/MA" },
];

export const OFFICIAL_BANKS = [
  {
    id: "sd",
    level: "sd" as const,
    fileId: 1,
    titleEn: "Official OSN question bank · SD",
    titleId: "Bank Soal OSN resmi · SD",
    url: "https://pusatprestasinasional.kemendikdasmen.go.id/api/download/1",
  },
  {
    id: "smp",
    level: "smp" as const,
    fileId: 4,
    titleEn: "Official OSN question bank · SMP",
    titleId: "Bank Soal OSN resmi · SMP",
    url: "https://pusatprestasinasional.kemendikdasmen.go.id/api/download/4",
  },
  {
    id: "sma-1",
    level: "sma" as const,
    fileId: 2,
    titleEn: "Official OSN question bank · SMA 1",
    titleId: "Bank Soal OSN resmi · SMA 1",
    url: "https://pusatprestasinasional.kemendikdasmen.go.id/api/download/2",
  },
  {
    id: "sma-2",
    level: "sma" as const,
    fileId: 3,
    titleEn: "Official OSN question bank · SMA 2",
    titleId: "Bank Soal OSN resmi · SMA 2",
    url: "https://pusatprestasinasional.kemendikdasmen.go.id/api/download/3",
  },
];

export const ARCHIVE_HOME = "https://forum.pelatihan-osn.com/arsip";
export const OFFICIAL_HOME = "https://pusatprestasinasional.kemendikdasmen.go.id/bank-soal-OSN";

export function isOsnLevel(value: string): value is OsnLevel {
  return value === "sd" || value === "smp" || value === "sma";
}
