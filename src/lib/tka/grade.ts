export type TkaTrack = "6" | "9" | "12";

const TRACK_RANK: Record<TkaTrack, number> = { "6": 6, "9": 9, "12": 12 };

export function suggestTrack(age: number): TkaTrack {
  if (age <= 12) return "6";
  if (age <= 15) return "9";
  return "12";
}

export function isTkaTrack(value: string): value is TkaTrack {
  return value === "6" || value === "9" || value === "12";
}

/** Higher tracks may review lower-grade banks. Lower tracks never see SMA/SMP above them. */
export function canAccessTrack(profileTrack: TkaTrack, contentTrack: TkaTrack): boolean {
  return TRACK_RANK[profileTrack] >= TRACK_RANK[contentTrack];
}

export function tracksVisibleFor(profileTrack: TkaTrack): TkaTrack[] {
  return (["6", "9", "12"] as const).filter((g) => canAccessTrack(profileTrack, g));
}

export function normalizeKelas(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "-");
}
