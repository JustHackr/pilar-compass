import { describe, expect, it } from "vitest";
import { SCHOOL } from "./school";

describe("SCHOOL identity", () => {
  it("uses a non-empty email domain without a leading @", () => {
    expect(SCHOOL.emailDomain).toMatch(/^[a-z0-9.-]+\.[a-z]{2,}$/i);
    expect(SCHOOL.adminEmail.endsWith(`@${SCHOOL.emailDomain}`)).toBe(true);
    expect(SCHOOL.contactEmail.endsWith(`@${SCHOOL.emailDomain}`)).toBe(true);
  });
});
