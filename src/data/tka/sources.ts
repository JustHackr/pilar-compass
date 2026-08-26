import type { TkaTrack } from "@/lib/tka/grade";
import type { TryoutKind } from "@/data/tka/tryouts";

export type PaperCluster = "wajib" | "ipa" | "ips";

export type TkaPaper = {
  id: string;
  track: TkaTrack;
  subjectId: string;
  cluster: PaperCluster;
  kind: TryoutKind;
  titleEn: string;
  titleId: string;
};

/** Every booklet the user supplied, filed by jenjang and mapel. */
export const TKA_PAPERS: TkaPaper[] = [
  {
    id: "sd-bi",
    track: "6",
    subjectId: "bahasa_indonesia",
    cluster: "wajib",
    kind: "latihan",
    titleEn: "SD Indonesian booklet (BI + Math pack)",
    titleId: "Bundel TKA SD · Bahasa Indonesia",
  },
  {
    id: "sd-math",
    track: "6",
    subjectId: "matematika",
    cluster: "wajib",
    kind: "latihan",
    titleEn: "SD Mathematics booklet (BI + Math pack)",
    titleId: "Bundel TKA SD · Matematika",
  },
  {
    id: "smp-bi",
    track: "9",
    subjectId: "bahasa_indonesia",
    cluster: "wajib",
    kind: "latihan",
    titleEn: "SMP Indonesian booklet (BI + Math pack)",
    titleId: "Bundel TKA SMP · Bahasa Indonesia",
  },
  {
    id: "smp-math-official",
    track: "9",
    subjectId: "matematika",
    cluster: "wajib",
    kind: "official",
    titleEn: "Official TKA SMP Mathematics 2025",
    titleId: "Soal Asli TKA Matematika SMP 2025",
  },
  {
    id: "smp-math-bundle",
    track: "9",
    subjectId: "matematika",
    cluster: "wajib",
    kind: "latihan",
    titleEn: "SMP Mathematics extra booklet items",
    titleId: "Bundel TKA SMP · Matematika tambahan",
  },
  {
    id: "sma-math-wajib",
    track: "12",
    subjectId: "matematika",
    cluster: "wajib",
    kind: "official",
    titleEn: "SMA Mathematics (compulsory) official-style",
    titleId: "Matematika SMA wajib · gaya naskah resmi",
  },
  {
    id: "sma-bi",
    track: "12",
    subjectId: "bahasa_indonesia",
    cluster: "wajib",
    kind: "official",
    titleEn: "Official TKA Indonesian SMA 2025",
    titleId: "Soal Asli TKA Bahasa Indonesia SMA 2025",
  },
  {
    id: "sma-en",
    track: "12",
    subjectId: "bahasa_inggris",
    cluster: "wajib",
    kind: "official",
    titleEn: "Official TKA English SMA 2025",
    titleId: "Soal Asli TKA Bahasa Inggris SMA 2025",
  },
  {
    id: "sma-kimia-asli",
    track: "12",
    subjectId: "kimia",
    cluster: "ipa",
    kind: "official",
    titleEn: "Official TKA Chemistry 2025",
    titleId: "Soal Asli TKA Kimia SMA 2025",
  },
  {
    id: "sma-kimia-to",
    track: "12",
    subjectId: "kimia",
    cluster: "ipa",
    kind: "latihan",
    titleEn: "Chemistry tryout practice 2025",
    titleId: "Latihan TO TKA Kimia 2025",
  },
  {
    id: "sma-fisika",
    track: "12",
    subjectId: "fisika",
    cluster: "ipa",
    kind: "latihan",
    titleEn: "TKA Physics SMA 2025 (elective paper)",
    titleId: "SOAL TKA Fisika SMA 2025 Pilihan",
  },
  {
    id: "sma-biologi",
    track: "12",
    subjectId: "biologi",
    cluster: "ipa",
    kind: "latihan",
    titleEn: "TKA Biology SMA 2025 (elective paper)",
    titleId: "SOAL TKA Biologi SMA 2025 Pilihan",
  },
  {
    id: "sma-lanjut",
    track: "12",
    subjectId: "matematika_lanjut",
    cluster: "ipa",
    kind: "latihan",
    titleEn: "TKA Advanced Mathematics SMA 2025",
    titleId: "SOAL TKA Matematika SMA 2025 Tingkat Lanjut",
  },
  {
    id: "sma-ekonomi",
    track: "12",
    subjectId: "ekonomi",
    cluster: "ips",
    kind: "latihan",
    titleEn: "TKA Economics SMA 2025 (elective paper)",
    titleId: "SOAL TKA Ekonomi SMA 2025 Pilihan",
  },
  {
    id: "sma-sosiologi",
    track: "12",
    subjectId: "sosiologi",
    cluster: "ips",
    kind: "latihan",
    titleEn: "TKA Sociology SMA 2025 (elective paper)",
    titleId: "SOAL TKA Sosiologi SMA 2025 Pilihan",
  },
  {
    id: "sma-geografi",
    track: "12",
    subjectId: "geografi",
    cluster: "ips",
    kind: "latihan",
    titleEn: "TKA Geography SMA 2025 (elective paper)",
    titleId: "SOAL TKA Geografi SMA 2025 Pilihan",
  },
  {
    id: "sma-sejarah",
    track: "12",
    subjectId: "sejarah",
    cluster: "ips",
    kind: "latihan",
    titleEn: "TKA History SMA 2025 (elective paper)",
    titleId: "SOAL TKA Sejarah SMA 2025 Pilihan",
  },
  {
    id: "sma-ppkn",
    track: "12",
    subjectId: "ppkn",
    cluster: "ips",
    kind: "latihan",
    titleEn: "TKA PPKn SMA 2025 (elective paper)",
    titleId: "SOAL TKA PPKn SMA 2025 Pilihan",
  },
];

export const PILIHAN_IPA_IDS = [
  "fisika",
  "kimia",
  "biologi",
  "matematika_lanjut",
] as const;

export const PILIHAN_IPS_IDS = [
  "ekonomi",
  "sosiologi",
  "geografi",
  "sejarah",
  "ppkn",
] as const;

export function papersFor(track: TkaTrack, subjectId: string): TkaPaper[] {
  return TKA_PAPERS.filter((p) => p.track === track && p.subjectId === subjectId);
}

export function clusterForSubject(subjectId: string): PaperCluster {
  if ((PILIHAN_IPA_IDS as readonly string[]).includes(subjectId)) return "ipa";
  if ((PILIHAN_IPS_IDS as readonly string[]).includes(subjectId)) return "ips";
  return "wajib";
}
