import type { SubjectScore } from "@/types";

export type ParseReportResult = {
  subjects: SubjectScore[];
  meanConfidence: number;
  ok: boolean;
};

const HEADER_WORDS =
  /^(nilai|rapor|raport|semester|kelas|nama|nis|no|nomor|subject|score|mata|pelajaran|keterangan|kkm|predikat|page|halaman|tahun|ajaran|absensi)$/i;

/** Parse OCR plain text into subject/score rows. */
export function parseReportText(
  text: string,
  meanConfidence = 100,
): ParseReportResult {
  const subjects: SubjectScore[] = [];
  const seen = new Set<string>();

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/\s+/g, " ").trim();
    if (!line || line.length < 3) continue;

    const hit = matchScoreLine(line);
    if (!hit) continue;

    const key = hit.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    subjects.push(hit);
  }

  const ok =
    subjects.length >= 2 &&
    (meanConfidence >= 50 || (subjects.length >= 3 && meanConfidence >= 40));

  return {
    subjects,
    meanConfidence: Math.round(meanConfidence * 10) / 10,
    ok,
  };
}

function matchScoreLine(line: string): SubjectScore | null {
  // "Matematika 88", "Bahasa Inggris: 90", "IPA — 85.5", "Science 85%"
  const m = line.match(
    /^(.{2,48}?)\s*[:\-–—|]\s*(\d{1,3}(?:[.,]\d+)?)\s*%?\s*$/,
  ) || line.match(/^(.{2,48}?)\s+(\d{1,3}(?:[.,]\d+)?)\s*%?\s*$/);

  if (!m) return null;

  let name = m[1]
    .replace(/[.|]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const scoreRaw = m[2].replace(",", ".");
  const score = Number(scoreRaw);

  if (!Number.isFinite(score) || score < 0 || score > 100) return null;
  if (name.length < 2 || name.length > 48) return null;
  if (/^\d+$/.test(name)) return null;
  if (HEADER_WORDS.test(name.split(" ")[0] ?? "")) return null;
  // Skip lines that look like dates / IDs
  if (/\d{2}[\/.-]\d{2}/.test(name)) return null;
  if (/^(total|rata|average|mean|jumlah)/i.test(name)) return null;

  // Round half scores to one decimal for display consistency with calculator ints
  const normalized = Number.isInteger(score) ? score : Math.round(score);

  return { name, score: normalized };
}

export function meanWordConfidence(
  words: { confidence?: number }[] | undefined,
): number {
  if (!words?.length) return 0;
  const vals = words
    .map((w) => w.confidence)
    .filter((c): c is number => typeof c === "number" && c >= 0);
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}
