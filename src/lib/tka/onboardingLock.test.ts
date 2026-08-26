import { beforeEach, describe, expect, it } from "vitest";
import { isTkaOnboarded, markTkaOnboarded } from "./onboardingLock";

const mem = new Map<string, string>();

beforeEach(() => {
  mem.clear();
  globalThis.localStorage = {
    getItem: (key: string) => mem.get(key) ?? null,
    setItem: (key: string, value: string) => {
      mem.set(key, value);
    },
    removeItem: (key: string) => {
      mem.delete(key);
    },
    clear: () => mem.clear(),
    key: () => null,
    get length() {
      return mem.size;
    },
  } as Storage;
});

describe("onboarding lock", () => {
  it("never treats a finished TKA account as new again", () => {
    expect(isTkaOnboarded("justin.rizki@pilar.sch.id")).toBe(false);
    markTkaOnboarded("justin.rizki@pilar.sch.id");
    expect(isTkaOnboarded("justin.rizki@pilar.sch.id")).toBe(true);
    expect(isTkaOnboarded("ada@pilar.sch.id")).toBe(false);
  });
});
