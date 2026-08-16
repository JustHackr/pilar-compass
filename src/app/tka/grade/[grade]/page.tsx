"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CATALOG, subjectById } from "@/data/tka/catalog";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { isTkaTrack } from "@/lib/tka/grade";
import { useTkaMe } from "@/components/tka/TkaGate";

export default function TkaGradePage() {
  const { t, locale } = useLocale();
  const params = useParams<{ grade: string }>();
  const { me } = useTkaMe();
  const grade = params.grade;
  if (!isTkaTrack(grade)) return null;
  const cat = CATALOG[grade];
  const profile = me.profile;

  if (!cat.playable || profile?.tkaTrack !== grade) {
    return (
      <div className="page-wrap tka-page">
        <p className="eyebrow">{t("tka.hub.eyebrow")}</p>
        <h1>{t("tka.grade", { n: grade })}</h1>
        <p className="lede">{t("tka.lockedGrade")}</p>
        <Link className="btn-secondary" href="/tka">
          {t("tka.backSkills")}
        </Link>
      </div>
    );
  }

  const pilihan = (profile?.pilihanIds ?? [])
    .map(subjectById)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="page-wrap tka-page">
      <p className="eyebrow">{t("tka.hub.eyebrow")}</p>
      <h1>{t("tka.grade", { n: grade })}</h1>

      <h2 className="tka-section">{t("tka.wajib")}</h2>
      <div className="tka-grade-grid">
        {cat.wajib.map((s) => (
          <Link
            key={s.id}
            href={s.playable ? `/tka/grade/${grade}/${s.id}` : "#"}
            className={s.playable ? "tka-card" : "tka-card tka-card-locked"}
            onClick={(e) => {
              if (!s.playable) e.preventDefault();
            }}
          >
            <h3>{locale === "id" ? s.labelId : s.labelEn}</h3>
            <p>{s.playable ? t("tka.open") : t("tka.comingSoon")}</p>
          </Link>
        ))}
      </div>

      <h2 className="tka-section">{t("tka.pilihan")}</h2>
      <div className="tka-grade-grid">
        {pilihan.map((s) => {
          const open = s.playable;
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
            </Link>
          );
        })}
      </div>

      {!pilihan.some((s) => s.id === "kimia") ? (
        <p className="tka-hint-line">
          {locale === "id" ? (
            <>
              Kimia sudah bisa dilatih. Ubah dua mapel pilihan di{" "}
              <Link href="/tka/onboarding">pengaturan jalur</Link> jika Kimia
              belum terpilih.
            </>
          ) : (
            <>
              Chemistry practice is ready. Change your two electives in{" "}
              <Link href="/tka/onboarding">path setup</Link> if Kimia is not
              selected.
            </>
          )}
        </p>
      ) : null}
    </div>
  );
}
