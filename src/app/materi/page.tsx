"use client";

import Link from "next/link";
import {
  SIBI_HOME,
  SIBI_K13,
  SIBI_MERDEKA,
  bookCountForGrade,
  gradesVisibleFor,
  subjectsForGrade,
} from "@/data/materi/bank";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useTkaMe } from "@/components/tka/TkaGate";

export default function MateriHubPage() {
  const { t } = useLocale();
  const { me } = useTkaMe();
  const grades = me.profile?.tkaTrack ? gradesVisibleFor(me.profile.tkaTrack) : [];

  return (
    <div className="page-wrap tka-page">
      <p className="eyebrow">{t("materi.hub.eyebrow")}</p>
      <h1>{t("materi.hub.title")}</h1>
      <p className="lede">{t("materi.hub.lede")}</p>

      <div className="tka-grade-grid">
        {grades.map((grade) => {
          const subjects = subjectsForGrade(grade);
          const n = bookCountForGrade(grade);
          return (
            <Link key={grade} href={`/materi/${grade}`} className="tka-card">
              <h2>{t("materi.grade", { n: grade })}</h2>
              <p>
                {t("materi.gradeMeta", {
                  subjects: subjects.length,
                  books: n,
                })}
              </p>
            </Link>
          );
        })}
      </div>

      <p className="tka-source">
        {t("materi.sourceNote")}{" "}
        <a href={SIBI_HOME} target="_blank" rel="noopener noreferrer">
          SIBI Kemendikdasmen
        </a>
        {" · "}
        <a href={SIBI_MERDEKA} target="_blank" rel="noopener noreferrer">
          {t("materi.curr.merdeka")}
        </a>
        {" · "}
        <a href={SIBI_K13} target="_blank" rel="noopener noreferrer">
          {t("materi.curr.k13")}
        </a>
      </p>
    </div>
  );
}
