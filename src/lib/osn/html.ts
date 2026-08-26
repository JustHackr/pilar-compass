export function sanitizeOsnHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function compactOsnHtml(html: string): string {
  return html.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
}

/** Split a question body into stem + A–E choices when markers exist. */
export function parseOsnChoices(bodyHtml: string): { stemHtml: string; choices: string[] } | null {
  const re = /(?:<(?:p|div|li)[^>]*>|<br\s*\/?>)\s*([A-E])(?:[.)]|&#46;)\s*/gi;
  const markers: { letter: string; start: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(bodyHtml))) {
    markers.push({ letter: m[1].toUpperCase(), start: m.index, end: m.index + m[0].length });
  }
  const seq: typeof markers = [];
  const wanted = "ABCDE";
  for (const mk of markers) {
    if (mk.letter === wanted[seq.length]) seq.push(mk);
    else if (seq.length >= 4) break;
    else if (mk.letter === "A") {
      seq.length = 0;
      seq.push(mk);
    }
  }
  if (seq.length < 4) return null;
  const stemHtml = compactOsnHtml(bodyHtml.slice(0, seq[0].start));
  const choices = seq.map((mk, i) => {
    const end = i + 1 < seq.length ? seq[i + 1].start : bodyHtml.length;
    return compactOsnHtml(bodyHtml.slice(mk.end, end).replace(/<\/(?:p|div|li)>\s*$/i, ""));
  });
  return { stemHtml, choices };
}

export function parseOsnMeta(text: string): {
  year: number | null;
  stage: "osk" | "osp" | "osn" | "other";
  format: "pilgan" | "essay" | "mixed";
} {
  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? Number(yearMatch[0]) : null;
  let stage: "osk" | "osp" | "osn" | "other" = "other";
  if (/\bKSN-K\b|\bOSK\b/i.test(text)) stage = "osk";
  else if (/\bKSN-P\b|\bOSP\b/i.test(text)) stage = "osp";
  else if (/\bKSN\b|\bOSN\b/i.test(text)) stage = "osn";
  let format: "pilgan" | "essay" | "mixed" = "mixed";
  if (/pilgan/i.test(text)) format = "pilgan";
  else if (/essay|esai/i.test(text)) format = "essay";
  return { year, stage, format };
}

export function sortPapersByYear<T extends { year: number | null; title: string }>(
  papers: T[],
  direction: "desc" | "asc" = "desc",
): T[] {
  const dir = direction === "desc" ? 1 : -1;
  return [...papers].sort((a, b) => {
    const ay = a.year ?? 0;
    const by = b.year ?? 0;
    if (ay !== by) return dir * (by - ay);
    return a.title.localeCompare(b.title);
  });
}
