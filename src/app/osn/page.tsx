"use client";

import Link from "next/link";
import {
  OFFICIAL_HOME,
  officialBanksFor,
  levelsVisibleFor,
  paperCountFor,
  subjectsForLevel,
} from "@/data/osn/bank";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useTkaMe } from "@/components/tka/TkaGate";

export default function OsnHubPage() {
  const { t, locale } = useLocale();
  const { me } = useTkaMe();
  const levels = me.profile?.tkaTrack ? levelsVisibleFor(me.profile.tkaTrack) : [];
  const banks = officialBanksFor();

  return (
    <div className="page-wrap tka-page">
      <p className="eyebrow">{t("osn.hub.eyebrow")}</p>
      <h1>{t("osn.hub.title")}</h1>
      <p className="lede">{t("osn.hub.lede")}</p>

      <div className="tka-grade-grid">
        {levels.map((level) => {
          const subjects = subjectsForLevel(level.id);
          const n = paperCountFor(level.id);
          return (
            <Link key={level.id} href={`/osn/${level.id}`} className="tka-card">
              <h2>{locale === "id" ? level.labelId : level.labelEn}</h2>
              <p>
                {t("osn.levelMeta", {
                  subjects: subjects.length,
                  papers: n,
                })}
              </p>
            </Link>
          );
        })}
      </div>

      <h2 className="tka-section">{t("osn.official")}</h2>
      <p className="lede">{t("osn.officialLede")}</p>
      <div className="tka-grade-grid">
        {banks.map((bank) => (
          <a
            key={bank.id}
            className="tka-card"
            href={bank.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="eyebrow">{t("osn.pdf")}</p>
            <h3>{locale === "id" ? bank.titleId : bank.titleEn}</h3>
            <p>{t("osn.downloadPdf")}</p>
          </a>
        ))}
      </div>

      <p className="tka-source">
        {t("osn.sourceNote")}{" "}
        <a href={OFFICIAL_HOME} target="_blank" rel="noopener noreferrer">
          Puspresnas
        </a>
      </p>
    </div>
  );
}
