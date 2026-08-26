"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CATALOG, type TkaSubject } from "@/data/tka/catalog";
import { PILIHAN_IPA_IDS, PILIHAN_IPS_IDS } from "@/data/tka/sources";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { canAccessTrack, isTkaTrack } from "@/lib/tka/grade";
import { useTkaMe } from "@/components/tka/TkaGate";

function SubjectCards({
  grade,
  subjects,
  picked,
  locale,
  t,
}: {
  grade: string;
  subjects: TkaSubject[];
  picked: string[];
  locale: string;
  t: (key: string) => string;
}) {
  if (!subjects.length) return null;
  return (
    <div className="tka-grade-grid">
      {subjects.map((s) => {
        const open = s.playable;
        const isPick = picked.includes(s.id);
        return (
          <Link
            key={s.id}
            href={open ? `/tka/grade/${grade}/${s.id}` : "#"}
            className={open ? "tka-card" : "tka-card tka-card-locked"}
            onClick={(e) => {
              if (!open) e.preventDefault();
            }}
          >
            <h3>{locale === "id" ? s.labelId : s.labelEn}</h3>
            <p>{open ? t("tka.open") : t("tka.comingSoon")}</p>
            {isPick ? <p className="tka-status">{t("tka.picked")}</p> : null}
          </Link>
        );
      })}
    </div>
  );
}

export default function TkaGradePage() {
  const { t, locale } = useLocale();
  const params = useParams<{ grade: string }>();
  const { me } = useTkaMe();
  const grade = params.grade;
  if (!isTkaTrack(grade)) return null;
  const cat = CATALOG[grade];
  const profile = me.profile;

  if (!cat.playable || !profile?.tkaTrack || !canAccessTrack(profile.tkaTrack, grade)) {
    return (
      <div className="page-wrap tka-page">
        <p className="eyebrow">{t("tka.hub.eyebrow")}</p>
        <h1>{t(`tka.track.${grade}`)}</h1>
        <p className="lede">{t("tka.lockedGrade")}</p>
        <Link className="btn-secondary" href="/tka">
          {t("tka.backSkills")}
        </Link>
      </div>
    );
  }

  const picked = profile?.pilihanIds ?? [];
  const ipa = cat.pilihan.filter(
    (s) => s.playable && (PILIHAN_IPA_IDS as readonly string[]).includes(s.id),
  );
  const ips = cat.pilihan.filter(
    (s) => s.playable && (PILIHAN_IPS_IDS as readonly string[]).includes(s.id),
  );

  return (
    <div className="page-wrap tka-page">
      <p className="eyebrow">{t("tka.hub.eyebrow")}</p>
      <h1>{t(`tka.track.${grade}`)}</h1>

      <h2 className="tka-section">{t("tka.wajib")}</h2>
      <SubjectCards
        grade={grade}
        subjects={cat.wajib}
        picked={picked}
        locale={locale}
        t={t}
      />

      {ipa.length ? (
        <>
          <h2 className="tka-section">{t("tka.pilihanIpa")}</h2>
          <SubjectCards
            grade={grade}
            subjects={ipa}
            picked={picked}
            locale={locale}
            t={t}
          />
        </>
      ) : null}

      {ips.length ? (
        <>
          <h2 className="tka-section">{t("tka.pilihanIps")}</h2>
          <SubjectCards
            grade={grade}
            subjects={ips}
            picked={picked}
            locale={locale}
            t={t}
          />
        </>
      ) : null}
    </div>
  );
}
