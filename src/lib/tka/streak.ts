import { daysBetweenWib } from "./wib";

export type StreakState = {
  streakCount: number;
  streakLastDate: string | null;
};

export type StreakResult = StreakState & {
  countedToday: boolean;
  incremented: boolean;
};

export function applyQualifyingActivity(
  state: StreakState,
  today: string,
): StreakResult {
  if (state.streakLastDate === today) {
    return {
      streakCount: state.streakCount,
      streakLastDate: today,
      countedToday: true,
      incremented: false,
    };
  }

  if (!state.streakLastDate) {
    return {
      streakCount: 1,
      streakLastDate: today,
      countedToday: true,
      incremented: true,
    };
  }

  const gap = daysBetweenWib(state.streakLastDate, today);
  if (gap === 1) {
    return {
      streakCount: state.streakCount + 1,
      streakLastDate: today,
      countedToday: true,
      incremented: true,
    };
  }

  return {
    streakCount: 1,
    streakLastDate: today,
    countedToday: true,
    incremented: true,
  };
}

export function streakBadges(count: number): number[] {
  return [3, 7, 14, 30].filter((n) => count >= n);
}
