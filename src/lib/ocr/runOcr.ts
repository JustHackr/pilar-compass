import { meanWordConfidence, parseReportText } from "@/lib/ocr/parseReport";
import type { ParseReportResult } from "@/lib/ocr/parseReport";

/** Run browser OCR on an image file (ind + eng). */
export async function ocrReportImage(file: File): Promise<ParseReportResult> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker(["ind", "eng"]);
  try {
    const {
      data: { text, words },
    } = await worker.recognize(file);
    const confidence = meanWordConfidence(words);
    return parseReportText(text, confidence);
  } finally {
    await worker.terminate();
  }
}
