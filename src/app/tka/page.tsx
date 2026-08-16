"use client";

import Link from "next/link";
import { CATALOG } from "@/data/tka/catalog";
import { ALL_TKA_SKILLS } from "@/data/tka/skills";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { streakBadges } from "@/lib/tka/streak";
import { useTkaMe } from "@/components/tka/TkaGate";

export default function TkaHubPage() {
  const { t, locale } = useLocale();
  const { me } = useTkaMe();
  const profile = me.profile;
  const badges = streakBadges(profile?.streakCount ?? 0);
  const continueSkill = ALL_TKA_SKILLS.find((s) =>
    me.mastery.some((m) => m.skillId === s.id && m.status === "learning"),
  );

  return (
    <div className="page-wrap tka-page">
      <p className="eyebrow">{t("tka.hub.eyebrow")}</p>
      <h1>{t("tka.hub.title")}</h1>
      <p className="lede">{t("tka.hub.lede")}</p>

      <div className="tka-stats">
        <div className="tka-stat">
          <span className="tka-flame" aria-hidden>
            🔥
          </span>
          <strong>{profile?.streakCount ?? 0}</strong>
          <span>{t("tka.streak")}</span>
          {badges.length ? (
            <small>{badges.map((b) => `${b}d`).join(" · ")}</small>
          ) : null}
        </div>
        <div className="tka-stat">
          <strong>{me.monthXp}</strong>
          <span>{t("tka.xpMonth")}</span>
        </div>
      </div>

      <div className="tka-actions">
        {continueSkill &&
        profile?.tkaTrack &&
        (continueSkill.track ?? "12") === profile.tkaTrack ? (
          <Link className="btn-primary" href={`/tka/lesson/${continueSkill.id}`}>
            {t("tka.continue")}
          </Link>
        ) : null}
        <Link className="btn-secondary" href="/tka/leaderboard">
          {t("tka.leaderboard")}
        </Link>
      </div>

      <div className="tka-grade-grid">
        {(["6", "9", "12"] as const).map((g) => {
          const cat = CATALOG[g];
          const locked = !cat.playable || profile?.tkaTrack !== g;
          return (
            <Link
              key={g}
              href={locked ? "#" : `/tka/grade/${g}`}
              className={locked ? "tka-card tka-card-locked" : "tka-card"}
              aria-disabled={locked}
              onClick={(e) => {
                if (locked) e.preventDefault();
              }}
            >
              <h2>{t("tka.grade", { n: g })}</h2>
              {locked ? (
                <p>{t("tka.comingSoon")}</p>
              ) : (
                <p>
                  {locale === "id"
                    ? g === "6"
                      ? "Matematika dan Bahasa Indonesia SD"
                      : g === "9"
                        ? "Matematika dan Bahasa Indonesia SMP"
                        : "Wajib Matematika, BI, Inggris, plus 8 mapel pilihan"
                    : g === "6"
                      ? "SD math and Indonesian"
                      : g === "9"
                        ? "SMP math and Indonesian"
                        : "Math, Indonesian, English, plus 8 electives"}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
