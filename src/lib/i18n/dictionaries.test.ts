import { describe, expect, it } from "vitest";
import { dictionaries } from "./dictionaries";

describe("dictionaries", () => {
  it("keeps English and Indonesian keys in sync", () => {
    expect(Object.keys(dictionaries.id).sort()).toEqual(
      Object.keys(dictionaries.en).sort(),
    );
  });
});
