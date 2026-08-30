"use client";

import Link from "next/link";
import { SCHOOL } from "@/config/school";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function HomePage() {
  const { t } = useLocale();

  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-copy animate-rise">
          <p className="eyebrow">{SCHOOL.name}</p>
          <h1 className="brand-title">{SCHOOL.productName}</h1>
          <p className="lede">{t("home.lede")}</p>
          <div className="cta-row">
            <Link href="/tka" className="btn-primary">
              {t("home.cta.tka")}
            </Link>
            <Link href="/osn" className="btn-secondary">
              {t("home.cta.osn")}
            </Link>
            <Link href="/materi" className="btn-secondary">
              {t("home.cta.materi")}
            </Link>
            <Link href="/competitions" className="btn-secondary">
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
