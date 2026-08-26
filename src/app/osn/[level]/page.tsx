"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  canAccessOsnLevel,
  isOsnLevel,
  officialBanksFor,
  paperCountFor,
  subjectsForLevel,
} from "@/data/osn/bank";
import { OSN_LEVELS } from "@/data/osn/types";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useTkaMe } from "@/components/tka/TkaGate";

export default function OsnLevelPage() {
  const { t, locale } = useLocale();
  const params = useParams<{ level: string }>();
  const { me } = useTkaMe();
  const level = params.level;
  if (!isOsnLevel(level)) return null;
  const meta = OSN_LEVELS.find((l) => l.id === level);
  const allowed =
    Boolean(me.profile?.tkaTrack) && canAccessOsnLevel(me.profile!.tkaTrack, level);

  if (!meta || !allowed) {
    return (
      <div className="page-wrap tka-page">
        <h1>{t("osn.locked")}</h1>
        <Link className="btn-secondary" href="/osn">
          {t("osn.back")}
        </Link>
      </div>
    );
  }

  const subjects = subjectsForLevel(level);
  const banks = officialBanksFor(level);

  return (
    <div className="page-wrap tka-page">
      <p className="eyebrow">{t("osn.hub.eyebrow")}</p>
      <h1>{locale === "id" ? meta.labelId : meta.labelEn}</h1>
      <p className="lede">{t("osn.levelLede")}</p>

      <h2 className="tka-section">{t("osn.courses")}</h2>
      <div className="tka-grade-grid">
        {subjects.map((s) => (
          <Link key={s.id} href={`/osn/${level}/${s.id}`} className="tka-card">
            <h3>{locale === "id" ? s.labelId : s.labelEn}</h3>
            <p>{t("osn.paperCount", { n: paperCountFor(level, s.id) })}</p>
          </Link>
        ))}
      </div>

      <h2 className="tka-section">{t("osn.official")}</h2>
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

      <Link className="btn-secondary" href="/osn">
        {t("osn.back")}
      </Link>
    </div>
  );
}
