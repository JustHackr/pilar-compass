export const WIB = "Asia/Jakarta";

export function wibParts(now: Date = new Date()): {
  year: number;
  month: number;
  day: number;
  dateStr: string;
} {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: WIB,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);
  return {
    year,
    month,
    day,
    dateStr: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
}

export function wibDateStr(now: Date = new Date()): string {
  return wibParts(now).dateStr;
}

export function daysBetweenWib(earlier: string, later: string): number {
  const a = Date.parse(`${earlier}T00:00:00+07:00`);
  const b = Date.parse(`${later}T00:00:00+07:00`);
  return Math.round((b - a) / 86_400_000);
}

export function monthKey(now: Date = new Date()): string {
  const { year, month } = wibParts(now);
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function inCurrentMonth(dateStr: string, now: Date = new Date()): boolean {
  return dateStr.startsWith(monthKey(now));
}
