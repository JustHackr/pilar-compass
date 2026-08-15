import { describe, expect, it } from "vitest";
import { suggestTrack, normalizeKelas } from "./grade";

describe("grade", () => {
  it("suggests tracks from age", () => {
    expect(suggestTrack(11)).toBe("6");
    expect(suggestTrack(12)).toBe("6");
    expect(suggestTrack(14)).toBe("9");
    expect(suggestTrack(15)).toBe("9");
    expect(suggestTrack(16)).toBe("12");
    expect(suggestTrack(18)).toBe("12");
  });

  it("normalizes kelas strings", () => {
    expect(normalizeKelas(" 12 a ")).toBe("12-A");
    expect(normalizeKelas("9-b")).toBe("9-B");
  });
});
