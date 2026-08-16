export type TryoutKind = "official" | "prediction" | "latihan";

export type TryoutPack = {
  id: string;
  kind: TryoutKind;
  track: "12";
  subjectId: string;
  titleEn: string;
  titleId: string;
  questionIds: string[];
  comingSoon?: boolean;
};

export const TRYOUT_PACKS: TryoutPack[] = [
  {
    id: "g12-math-official-1",
    kind: "official",
    track: "12",
    subjectId: "matematika",
    titleEn: "Official-style paper 1 · SMA Mathematics",
    titleId: "Paket resmi-gaya 1 · Matematika SMA",
    questionIds: [
      "m12-spl-01",
      "m12-spl-02",
      "m12-invers-01",
      "m12-komp-01",
      "m12-baris-01",
      "m12-volume-01",
      "m12-trig-01",
      "m12-stat-01",
      "m12-peluang-02",
      "m12-pl-01",
      "m12-fungsi-01",
      "m12-trans-01",
      "m12-hitung-01",
    ],
  },
  {
    id: "g12-math-prediction-1",
    kind: "prediction",
    track: "12",
    subjectId: "matematika",
    titleEn: "Prediction set (coming soon)",
    titleId: "Paket prediksi (segera hadir)",
    questionIds: [],
    comingSoon: true,
  },
  {
    id: "g12-kimia-official-2025",
    kind: "official",
    track: "12",
    subjectId: "kimia",
    titleEn: "Official TKA Chemistry 2025",
    titleId: "TKA Kimia Asli 2025",
    questionIds: [
      "k12-o-01",
      "k12-o-03",
      "k12-o-04",
      "k12-o-05",
      "k12-o-09",
      "k12-o-10",
      "k12-o-11",
      "k12-o-12",
      "k12-o-14",
      "k12-o-15",
      "k12-o-18",
      "k12-o-19",
      "k12-o-21",
      "k12-o-24",
    ],
  },
  {
    id: "g12-kimia-latihan-2025",
    kind: "latihan",
    track: "12",
    subjectId: "kimia",
    titleEn: "Chemistry practice set 2025",
    titleId: "Set latihan TKA Kimia 2025",
    questionIds: [
      "k12-l-01",
      "k12-l-02",
      "k12-l-03",
      "k12-l-04",
      "k12-l-05",
      "k12-l-06",
      "k12-l-07",
      "k12-l-08",
      "k12-l-10",
      "k12-l-12",
      "k12-l-15",
      "k12-l-16",
      "k12-l-17",
      "k12-l-19",
      "k12-l-20",
    ],
  },
];

export function tryoutById(id: string): TryoutPack | undefined {
  return TRYOUT_PACKS.find((p) => p.id === id);
}
