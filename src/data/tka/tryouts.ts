export type TryoutKind = "official" | "prediction";

export type TryoutPack = {
  id: string;
  kind: TryoutKind;
  track: "12";
  subjectId: "matematika";
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
];

export function tryoutById(id: string): TryoutPack | undefined {
  return TRYOUT_PACKS.find((p) => p.id === id);
}
