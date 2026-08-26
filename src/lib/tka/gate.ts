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

export function preferOnboardedMe(
  server: TkaPublicMe,
  cached: TkaPublicMe | null,
): TkaPublicMe {
  if (server.profile?.onboardingCompletedAt) return server;
  if (cached?.profile?.onboardingCompletedAt) return cached;
  return server;
}
