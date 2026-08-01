"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function HomePage() {
  const { t } = useLocale();

  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-copy animate-rise">
          <p className="eyebrow">Sekolah Pilar Indonesia</p>
          <h1 className="brand-title">Pilar Compass</h1>
          <p className="lede">{t("home.lede")}</p>
          <div className="cta-row">
            <Link href="/competitions" className="btn-primary">
              {t("home.cta.comps")}
            </Link>
            <Link href="/calculator" className="btn-secondary">
              {t("home.cta.calc")}
            </Link>
          </div>
          <div className="hero-meta" aria-label="Who this is for">
            <span>{t("home.meta.grades")}</span>
            <span>{t("home.meta.scope")}</span>
            <span>{t("home.meta.spi")}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
