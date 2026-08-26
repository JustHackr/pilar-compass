import { describe, expect, it } from "vitest";
import {
  ADMIN_EMAIL,
  SPI_CLASSES,
  classesForTrack,
  isAdminEmail,
  matchSpiClass,
} from "./spi-classes";

describe("SPI classes", () => {
  it("lists every current homeroom city class", () => {
    expect(SPI_CLASSES.map((c) => c.label)).toEqual([
      "Grade 4 Boston",
      "Grade 4 Sydney",
      "Grade 5 Berlin",
      "Grade 5 Brussels",
      "Grade 6 Leiden",
      "Grade 7 Istanbul",
      "Grade 8 Helsinki",
      "Grade 9 Manchester",
      "Grade 10 Arizona",
      "Grade 10 Adelaide",
      "Grade 11 Orlando",
      "Grade 11 Oxford",
      "Grade 12 Rio De Janeiro",
      "Grade 12 Rotterdam",
    ]);
  });

  it("maps SD/SMP/SMA tracks from the grade band", () => {
    expect(classesForTrack("6").map((c) => c.id)).toEqual([
      "4-BOSTON",
      "4-SYDNEY",
      "5-BERLIN",
      "5-BRUSSELS",
      "6-LEIDEN",
    ]);
    expect(classesForTrack("9").map((c) => c.id)).toEqual([
      "7-ISTANBUL",
      "8-HELSINKI",
      "9-MANCHESTER",
    ]);
    expect(classesForTrack("12")).toHaveLength(6);
  });

  it("matches stored kelas ids and city names", () => {
    expect(matchSpiClass("12-rio-de-janeiro")?.id).toBe("12-RIO-DE-JANEIRO");
    expect(matchSpiClass("Rotterdam")?.label).toBe("Grade 12 Rotterdam");
    expect(matchSpiClass("Grade 4 Boston")?.id).toBe("4-BOSTON");
    expect(matchSpiClass("12-A")).toBeUndefined();
  });

  it("recognizes only the school admin email", () => {
    expect(ADMIN_EMAIL).toBe("admin@pilar.sch.id");
    expect(isAdminEmail("Admin@Pilar.sch.id")).toBe(true);
    expect(isAdminEmail(" ada@pilar.sch.id ")).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
  });
});
