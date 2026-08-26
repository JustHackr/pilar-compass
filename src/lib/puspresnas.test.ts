import { describe, expect, it } from "vitest";
import {
  competitionFromEvent,
  competitionsFromEvents,
  fieldFromEvent,
  isCurrentAcademicEvent,
  jenjangFromEvent,
  type PuspresnasRawEvent,
} from "./puspresnas";

function event(partial: Partial<PuspresnasRawEvent> & Pick<PuspresnasRawEvent, "id">): PuspresnasRawEvent {
  return {
    nama_event: "Olimpiade Sains Nasional 2026",
    nama_singkat: "OSN",
    slug: "olimpiade-sains-nasional-2026-2026-sma",
    start: "2026-02-24",
    end: "2026-09-20",
    route:
      "https://pusatprestasinasional.kemendikdasmen.go.id/event/riset-dan-inovasi/sma/olimpiade-sains-nasional-2026-2026-sma",
    category: { slug: "riset-dan-inovasi" },
    ...partial,
  };
}

describe("puspresnas catalog", () => {
  it("reads jenjang from the official event route", () => {
    expect(jenjangFromEvent(event({ id: 1 }))).toBe("sma");
    expect(
      jenjangFromEvent(
        event({
          id: 2,
          slug: "opsi-2026-2026-smp",
          route:
            "https://pusatprestasinasional.kemendikdasmen.go.id/event/riset-dan-inovasi/smp/opsi-2026",
        }),
      ),
    ).toBe("smp");
  });

  it("keeps SMP/SMA/SMK academic events and drops SD, Diksus, and last year", () => {
    const now = new Date("2026-08-26T00:00:00+07:00");
    expect(isCurrentAcademicEvent(event({ id: 1 }), now)).toBe(true);
    expect(
      isCurrentAcademicEvent(
        event({
          id: 2,
          slug: "osn-2026-2026-sd",
          route:
            "https://pusatprestasinasional.kemendikdasmen.go.id/event/riset-dan-inovasi/sd/osn-2026",
        }),
        now,
      ),
    ).toBe(false);
    expect(
      isCurrentAcademicEvent(
        event({
          id: 3,
          nama_event: "OSN 2025",
          slug: "osn-2025-2025-sma",
          start: "2025-03-19",
          end: "2025-09-27",
          route:
            "https://pusatprestasinasional.kemendikdasmen.go.id/event/riset-dan-inovasi/sma/osn-2025",
        }),
        now,
      ),
    ).toBe(false);
  });

  it("maps FIKSI to business and debate to language", () => {
    expect(
      fieldFromEvent(
        event({ id: 4, nama_singkat: "FIKSI", nama_event: "Festival Inovasi 2026" }),
      ),
    ).toBe("business");
    expect(
      fieldFromEvent(
        event({
          id: 5,
          nama_singkat: "LDI",
          nama_event: "Lomba Debat Indonesia 2026",
          category: { slug: "seni-budaya" },
        }),
      ),
    ).toBe("language");
  });

  it("turns a Puspresnas event into a competition card", () => {
    const c = competitionFromEvent(event({ id: 156 }));
    expect(c?.id).toBe("puspresnas-156");
    expect(c?.scope).toBe("indonesia");
    expect(c?.level).toBe("senior");
    expect(c?.name).toContain("SMA");
    expect(c?.registrationDeadline).toBe("2026-09-20");
    expect(c?.links?.some((l) => l.kind === "register")).toBe(true);
  });

  it("dedupes and sorts by official window end", () => {
    const now = new Date("2026-08-26T00:00:00+07:00");
    const list = competitionsFromEvents(
      [
        event({ id: 10, end: "2026-10-12", slug: "fls3n-2026-sma", route: ".../sma/fls3n" }),
        event({ id: 10, end: "2026-10-12", slug: "fls3n-2026-sma", route: ".../sma/fls3n" }),
        event({ id: 9, end: "2026-08-31", slug: "osn-2026-smp", route: ".../smp/osn" }),
      ],
      now,
    );
    expect(list.map((c) => c.id)).toEqual(["puspresnas-9", "puspresnas-10"]);
  });
});

describe("Puspresnas TLS pin", () => {
  it("accepts DigiCert ministry names and rejects other hosts", async () => {
    const { assertPuspresnasPeer } = await import("./kemendikdasmen-fetch");
    const cert = {
      subject: { CN: "*.kemendikdasmen.go.id" },
      issuer: { O: "DigiCert Inc", CN: "DigiCert Global G2 TLS RSA SHA256 2020 CA1" },
      subjectaltname: "DNS:*.kemendikdasmen.go.id",
    };
    expect(() =>
      assertPuspresnasPeer("pusatprestasinasional.kemendikdasmen.go.id", cert),
    ).not.toThrow();
    expect(() => assertPuspresnasPeer("evil.example", cert)).toThrow(/host/);
    expect(() =>
      assertPuspresnasPeer("pusatprestasinasional.kemendikdasmen.go.id", {
        ...cert,
        issuer: { O: "Evil CA", CN: "Evil" },
      }),
    ).toThrow(/issuer/);
  });
});
