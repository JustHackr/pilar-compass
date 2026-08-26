import { describe, expect, it } from "vitest";
import { preferOnboardedMe, tkaGateRedirect } from "./gate";
import type { TkaPublicMe } from "./types";

function me(email: string, completed: boolean, streak = 0): TkaPublicMe {
  return {
    email,
    profile: completed
      ? {
          email,
          displayName: "Justin",
          age: 17,
          tkaTrack: "12",
          kelas: "12-RIO-DE-JANEIRO",
          pilihanIds: ["fisika", "kimia"],
          onboardingCompletedAt: "2026-08-19T00:00:00.000Z",
          streakCount: streak,
          streakLastDate: "2026-08-19",
        }
      : null,
    today: {
      lessonsCompleted: 0,
      tryoutsSubmitted: 0,
      xpEarned: 0,
      streakCounted: false,
    },
    monthXp: 0,
    monthScore: 0,
    mastery: [],
  };
}

describe("tkaGateRedirect", () => {
  it("sends an onboarded student back to the TKA hub if the browser returns to onboarding", () => {
    expect(
      tkaGateRedirect({
        pathname: "/tka/onboarding",
        email: "justin.rizki@pilar.sch.id",
        onboarded: true,
      }),
    ).toBe("/tka");
  });

  it("never sends a finished student to onboarding, even with no live profile", () => {
    expect(
      tkaGateRedirect({
        pathname: "/tka",
        email: "justin.rizki@pilar.sch.id",
        onboarded: true,
      }),
    ).toBeNull();
    expect(
      tkaGateRedirect({
        pathname: "/tka/lesson/spl",
        email: "justin.rizki@pilar.sch.id",
        onboarded: true,
      }),
    ).toBeNull();
    expect(
      tkaGateRedirect({
        pathname: "/tka/onboarding",
        email: "justin.rizki@pilar.sch.id",
        onboarded: true,
      }),
    ).toBe("/tka");
  });

  it("only sends a new student to onboarding until they finish setup", () => {
    expect(
      tkaGateRedirect({
        pathname: "/tka",
        email: "new.student@pilar.sch.id",
        onboarded: false,
      }),
    ).toBe("/tka/onboarding");
    expect(
      tkaGateRedirect({
        pathname: "/tka/onboarding",
        email: "new.student@pilar.sch.id",
        onboarded: false,
      }),
    ).toBeNull();
  });
});

describe("preferOnboardedMe", () => {
  it("keeps the cached dashboard when the server forgot the profile", () => {
    const cached = me("justin.rizki@pilar.sch.id", true, 4);
    const server = me("justin.rizki@pilar.sch.id", false);
    const next = preferOnboardedMe(server, cached);
    expect(next.profile?.onboardingCompletedAt).toBeTruthy();
    expect(next.profile?.streakCount).toBe(4);
  });
});
