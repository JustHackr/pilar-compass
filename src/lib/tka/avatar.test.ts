import { describe, expect, it } from "vitest";
import { AVATAR_MAX_CHARS, normalizeAvatarDataUrl } from "./avatar";

const JPEG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD";

describe("normalizeAvatarDataUrl", () => {
  it("keeps a compact jpeg data URL", () => {
    expect(normalizeAvatarDataUrl(JPEG)).toBe(JPEG);
  });

  it("clears an empty or null photo", () => {
    expect(normalizeAvatarDataUrl(null)).toBeNull();
    expect(normalizeAvatarDataUrl("")).toBeNull();
  });

  it("rejects svg, html, and oversized payloads", () => {
    expect(normalizeAvatarDataUrl("data:image/svg+xml;base64,PHN2Zz4=")).toBeUndefined();
    expect(normalizeAvatarDataUrl("https://example.com/me.jpg")).toBeUndefined();
    expect(normalizeAvatarDataUrl(`data:image/jpeg;base64,${"A".repeat(AVATAR_MAX_CHARS)}`)).toBeUndefined();
  });
});
