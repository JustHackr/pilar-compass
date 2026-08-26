"use client";

import Link from "next/link";
import { ALL_TKA_SKILLS } from "@/data/tka/skills";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { canAccessTrack, tracksVisibleFor } from "@/lib/tka/grade";
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
        canAccessTrack(profile.tkaTrack, continueSkill.track ?? "12") ? (
          <Link className="btn-primary" href={`/tka/lesson/${continueSkill.id}`}>
            {t("tka.continue")}
          </Link>
        ) : null}
        <Link className="btn-secondary" href="/tka/leaderboard">
          {t("tka.leaderboard")}
        </Link>
      </div>

      <div className="tka-grade-grid">
        {(profile?.tkaTrack ? tracksVisibleFor(profile.tkaTrack) : []).map((g) => (
          <Link key={g} href={`/tka/grade/${g}`} className="tka-card">
            <h2>{t(`tka.track.${g}`)}</h2>
            <p>
              {locale === "id"
                ? g === "6"
                  ? "Wajib: Matematika, Bahasa Indonesia"
                  : g === "9"
                    ? "Wajib: Matematika, Bahasa Indonesia"
                    : "Wajib: Matematika, BI, Inggris · Pilihan IPA & IPS"
                : g === "6"
                  ? "Compulsory: Math, Indonesian"
                  : g === "9"
                    ? "Compulsory: Math, Indonesian"
                    : "Compulsory math, Indonesian, English · science & social electives"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
