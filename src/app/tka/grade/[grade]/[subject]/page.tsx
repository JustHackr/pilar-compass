"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { isPlayableSubject, subjectById } from "@/data/tka/catalog";
import { skillsForSubject } from "@/data/tka/bank";
import { tryoutsForSubject } from "@/data/tka/tryouts";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { canAccessTrack, isTkaTrack } from "@/lib/tka/grade";
import { useTkaMe } from "@/components/tka/TkaGate";

export default function TkaSubjectPage() {
  const { t, locale } = useLocale();
  const params = useParams<{ grade: string; subject: string }>();
  const { me } = useTkaMe();
  const grade = params.grade;
  const subjectId = params.subject;
  if (!isTkaTrack(grade)) return null;
  const subject = subjectById(subjectId);
  const playable = isPlayableSubject(grade, subjectId);

  if (
    !subject ||
    !playable ||
    !me.profile?.tkaTrack ||
    !canAccessTrack(me.profile.tkaTrack, grade)
  ) {
    return (
      <div className="page-wrap tka-page">
        <h1>{t("tka.lockedSubject")}</h1>
        <Link className="btn-secondary" href={`/tka/grade/${grade}`}>
          {t("tka.backSkills")}
        </Link>
      </div>
    );
  }

  const skills = skillsForSubject(subjectId, grade);
  const packs = tryoutsForSubject(grade, subjectId);

  return (
    <div className="page-wrap tka-page">
      <p className="eyebrow">{t(`tka.track.${grade}`)}</p>
      <h1>{locale === "id" ? subject.labelId : subject.labelEn}</h1>

      <h2 className="tka-section">{t("tka.lesson")}</h2>
      <ul className="tka-skill-list">
        {skills.map((sk) => {
          const status =
            me.mastery.find((m) => m.skillId === sk.id)?.status ?? "unseen";
          return (
            <li key={sk.id} className="tka-skill">
              <div>
                <h3>{locale === "id" ? sk.titleId : sk.titleEn}</h3>
                <p className="tka-status">{t(`tka.${status}`)}</p>
              </div>
              <Link className="btn-primary" href={`/tka/lesson/${sk.id}`}>
                {t("tka.lesson")}
              </Link>
            </li>
          );
        })}
      </ul>

      <h2 className="tka-section">{t("tka.tryout")}</h2>
      <div className="tka-grade-grid">
        {packs.map((p) => (
          <div key={p.id} className={p.comingSoon ? "tka-card tka-card-locked" : "tka-card"}>
            <p className="eyebrow">
              {p.kind === "official"
                ? t("tka.official")
                : p.kind === "latihan"
                  ? t("tka.latihan")
                  : t("tka.prediction")}
            </p>
            <h3>{locale === "id" ? p.titleId : p.titleEn}</h3>
            {p.comingSoon ? (
              <p>{t("tka.comingSoon")}</p>
            ) : (
              <Link className="btn-secondary" href={`/tka/tryout/${p.id}`}>
                {t("tka.startTryout")}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
