"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  bookCountForGrade,
  canAccessMateriGrade,
  isMateriGrade,
  subjectsForGrade,
  type MateriGrade,
} from "@/data/materi/bank";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useTkaMe } from "@/components/tka/TkaGate";

export default function MateriGradePage() {
  const { t, locale } = useLocale();
  const params = useParams<{ grade: string }>();
  const { me } = useTkaMe();
  const gradeRaw = params.grade;
  if (!isMateriGrade(gradeRaw)) return null;
  const grade = Number(gradeRaw) as MateriGrade;
  const allowed =
    Boolean(me.profile?.tkaTrack) && canAccessMateriGrade(me.profile!.tkaTrack, grade);

  if (!allowed) {
    return (
      <div className="page-wrap tka-page">
        <h1>{t("materi.locked")}</h1>
        <Link className="btn-secondary" href="/materi">
          {t("materi.back")}
        </Link>
      </div>
    );
  }

  const subjects = subjectsForGrade(grade);

  return (
    <div className="page-wrap tka-page">
      <p className="eyebrow">{t("materi.hub.eyebrow")}</p>
      <h1>{t("materi.grade", { n: grade })}</h1>
      <p className="lede">{t("materi.gradeLede")}</p>

      <h2 className="tka-section">{t("materi.subjects")}</h2>
      <div className="tka-grade-grid">
        {subjects.map((s) => (
          <Link key={s.id} href={`/materi/${grade}/${s.id}`} className="tka-card">
            <h3>{locale === "id" ? s.labelId : s.labelEn}</h3>
            <p>
              {bookCountForGrade(grade, s.id) === 1
                ? t("materi.bookCountOne")
                : t("materi.bookCount", { n: bookCountForGrade(grade, s.id) })}
            </p>
          </Link>
        ))}
      </div>

      <Link className="btn-secondary" href="/materi">
        {t("materi.back")}
      </Link>
    </div>
  );
}
