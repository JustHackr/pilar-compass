const TOUR_KEY = "pilar_compass_tour_seen";

export function hasSeenTour(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(TOUR_KEY) === "1";
}

export function markTourSeen(): void {
  localStorage.setItem(TOUR_KEY, "1");
}

export function resetTour(): void {
  localStorage.removeItem(TOUR_KEY);
}
