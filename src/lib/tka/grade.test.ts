import { describe, expect, it } from "vitest";
import { suggestTrack, normalizeKelas, canAccessTrack, tracksVisibleFor } from "./grade";

describe("grade", () => {
  it("suggests tracks from age", () => {
    expect(suggestTrack(11)).toBe("6");
    expect(suggestTrack(12)).toBe("6");
    expect(suggestTrack(14)).toBe("9");
    expect(suggestTrack(15)).toBe("9");
    expect(suggestTrack(16)).toBe("12");
    expect(suggestTrack(18)).toBe("12");
  });

  it("lets higher tracks review lower-grade material", () => {
    expect(canAccessTrack("12", "12")).toBe(true);
    expect(canAccessTrack("12", "9")).toBe(true);
    expect(canAccessTrack("12", "6")).toBe(true);
    expect(canAccessTrack("9", "12")).toBe(false);
    expect(canAccessTrack("9", "9")).toBe(true);
    expect(canAccessTrack("9", "6")).toBe(true);
    expect(canAccessTrack("6", "9")).toBe(false);
    expect(tracksVisibleFor("6")).toEqual(["6"]);
    expect(tracksVisibleFor("9")).toEqual(["6", "9"]);
    expect(tracksVisibleFor("12")).toEqual(["6", "9", "12"]);
  });

  it("normalizes kelas strings", () => {
    expect(normalizeKelas(" 12 a ")).toBe("12-A");
    expect(normalizeKelas("9-b")).toBe("9-B");
  });
});
