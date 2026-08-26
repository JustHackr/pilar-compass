import { describe, expect, it } from "vitest";
import { EMAIL_KEY, isValidEmail, restoreStoredEmail, SCHOOL_EMAIL_DOMAIN } from "./session";

describe("isValidEmail", () => {
  it("only accepts the SPI school domain", () => {
    expect(SCHOOL_EMAIL_DOMAIN).toBe("pilar.sch.id");
    expect(isValidEmail("ada@pilar.sch.id")).toBe(true);
    expect(isValidEmail(" Ada@Pilar.sch.id ")).toBe(true);
    expect(isValidEmail("student+tka@pilar.sch.id")).toBe(true);
  });

  it("rejects other domains and guest addresses", () => {
    expect(isValidEmail("ada@gmail.com")).toBe(false);
    expect(isValidEmail("demo@sekolah-pilar-indonesia.sch.id")).toBe(false);
    expect(isValidEmail("ada@mail.pilar.sch.id")).toBe(false);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("ada@ pilar.sch.id")).toBe(false);
  });

  it("keeps a valid stored school email so switching tabs does not log the user out", () => {
    const store = new Map<string, string>([
      [EMAIL_KEY, "rina.12-rio-de-janeiro@pilar.sch.id"],
    ]);
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      removeItem: (key: string) => {
        store.delete(key);
      },
    };
    const previousWindow = globalThis.window;
    const previousStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { localStorage: storage },
    });
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: storage,
    });
    try {
      expect(restoreStoredEmail()).toBe("rina.12-rio-de-janeiro@pilar.sch.id");
    } finally {
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: previousWindow,
      });
      if (previousStorage) {
        Object.defineProperty(globalThis, "localStorage", previousStorage);
      } else {
        Reflect.deleteProperty(globalThis, "localStorage");
      }
    }
  });
});
