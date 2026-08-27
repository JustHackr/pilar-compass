import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { OsnQuestion } from "@/data/osn/types";

const PAPER_ID_RE = /^[A-Za-z0-9_-]{1,32}$/;

export function loadOsnQuestions(paperId: string): OsnQuestion[] {
  if (!PAPER_ID_RE.test(paperId)) return [];
  try {
    const raw = readFileSync(
      join(process.cwd(), "public", "osn", "questions", `${paperId}.json`),
      "utf8",
    );
    const data = JSON.parse(raw) as unknown;
    return Array.isArray(data) ? (data as OsnQuestion[]) : [];
  } catch {
    return [];
  }
}
