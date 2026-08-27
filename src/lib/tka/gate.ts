import { isAdminEmail } from "@/data/spi-classes";
import type { TkaPublicMe } from "./types";

export function tkaGateRedirect(input: {
  pathname: string;
  email: string;
  onboarded: boolean;
}): "/tka" | "/tka/onboarding" | null {
  const done = input.onboarded || isAdminEmail(input.email);
  if (done) {
    return input.pathname === "/tka/onboarding" ? "/tka" : null;
  }
  return input.pathname === "/tka/onboarding" ? null : "/tka/onboarding";
}

function progressWeight(me: TkaPublicMe): number {
  return (
    (me.monthXp ?? 0) +
    (me.monthScore ?? 0) +
    (me.profile?.streakCount ?? 0) +
    (me.today.lessonsCompleted ?? 0) +
    (me.today.tryoutsSubmitted ?? 0) +
    (me.today.xpEarned ?? 0) +
    me.mastery.length
  );
}

export function preferOnboardedMe(
  server: TkaPublicMe,
  cached: TkaPublicMe | null,
): TkaPublicMe {
  if (server.profile?.onboardingCompletedAt && cached?.profile?.onboardingCompletedAt) {
    return progressWeight(cached) > progressWeight(server) ? cached : server;
  }
  if (server.profile?.onboardingCompletedAt) return server;
  if (cached?.profile?.onboardingCompletedAt) return cached;
  return server;
}
