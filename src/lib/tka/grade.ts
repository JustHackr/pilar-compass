export type TkaTrack = "6" | "9" | "12";

export function suggestTrack(age: number): TkaTrack {
  if (age <= 12) return "6";
  if (age <= 15) return "9";
  return "12";
}

export function isTkaTrack(value: string): value is TkaTrack {
  return value === "6" || value === "9" || value === "12";
}

export function normalizeKelas(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "-");
}
