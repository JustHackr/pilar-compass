import type { TkaQuestion } from "./scoring";

export const LESSON_UNIQUE_TARGET = 6;

export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickLessonItems(
  skillId: string,
  bank: TkaQuestion[],
  random: () => number = Math.random,
): TkaQuestion[] {
  const primary = shuffle(
    bank.filter((q) => q.skillId === skillId),
    random,
  );
  const rest = shuffle(
    bank.filter((q) => q.skillId !== skillId),
    random,
  );
  const unique: TkaQuestion[] = [];
  for (const q of [...primary, ...rest]) {
    if (unique.length >= LESSON_UNIQUE_TARGET) break;
    unique.push(q);
  }
  return unique;
}

/** Insert a redemption of `id` at least two seats later (not next). */
export function enqueueRedemption(queue: string[], currentId: string): string[] {
  const remaining = queue.filter((id) => id !== currentId);
  if (remaining.length === 0) return [currentId];
  const minIndex = Math.min(1, remaining.length);
  const insertAt = Math.min(remaining.length, minIndex + 1);
  const next = [...remaining];
  next.splice(insertAt, 0, currentId);
  return next;
}

export type MissState = { misses: number; redeemed: boolean };

export function nextOutcomeAfterCheck(
  wasCorrect: boolean,
  missesBefore: number,
): { outcome?: "first_try" | "redemption" | "revealed"; enqueue: boolean; reveal: boolean } {
  if (wasCorrect) {
    if (missesBefore === 0) return { outcome: "first_try", enqueue: false, reveal: false };
    return { outcome: "redemption", enqueue: false, reveal: false };
  }
  if (missesBefore === 0) return { enqueue: true, reveal: false };
  return { outcome: "revealed", enqueue: false, reveal: true };
}
