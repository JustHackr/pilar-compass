"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { clearSession } from "@/lib/session";
import { resetTour } from "@/lib/tour";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { LocaleToggle } from "@/lib/i18n/LocaleToggle";
import { OnboardingTour } from "@/components/OnboardingTour";
import { isAdminEmail } from "@/data/spi-classes";
import { logClientActivity, tkaFetchInit } from "@/lib/tka/client";

type Props = {
  email: string;
  onSignOut: () => void;
  children: React.ReactNode;
};

export function AppShell({ email, onSignOut, children }: Props) {
  const pathname = usePathname();
  const { t } = useLocale();
  const [replayTour, setReplayTour] = useState(false);

  const lastPath = useRef<string | null>(null);

  async function signOut() {
    await fetch("/api/tka/logout", tkaFetchInit({ method: "POST" }));
    clearSession();
    onSignOut();
  }

  function showIntro() {
    resetTour();
    setReplayTour(true);
  }

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    logClientActivity("page_view", pathname);
  }, [pathname]);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/tka", label: t("nav.tka") },
    { href: "/osn", label: t("nav.osn") },
    { href: "/competitions", label: t("nav.competitions") },
    { href: "/calculator", label: t("nav.calculator") },
    ...(isAdminEmail(email) ? [{ href: "/admin", label: t("nav.admin") }] : []),
  ];

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-contact">
            <a href="mailto:spi@pilar.sch.id">spi@pilar.sch.id</a>
            <span className="topbar-sep">·</span>
            <span>{t("topbar.forStudents")}</span>
          </div>
          <div className="topbar-right">
            <LocaleToggle />
            <span className="topbar-email" title={email}>
              {email}
            </span>
            <button type="button" className="topbar-signout" onClick={signOut}>
              {t("topbar.signOut")}
            </button>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="logo-lockup">
            <Image
              src="/spi-logo.png"
              alt="Sekolah Pilar Indonesia"
              width={200}
              height={56}
              className="spi-logo"
              priority
            />
            <span className="logo-product">
              <strong>Pilar Compass</strong>
              <small>{t("logo.product")}</small>
            </span>
          </Link>

          <nav className="site-nav" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  l.href === "/"
                    ? pathname === "/"
                      ? "nav-link active"
                      : "nav-link"
                    : pathname === l.href || pathname.startsWith(`${l.href}/`)
                      ? "nav-link active"
                      : "nav-link"
                }
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="site-main">{children}</main>

      <OnboardingTour
        forceOpen={replayTour}
        onClose={() => setReplayTour(false)}
      />

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <h3>PILAR INDONESIA</h3>
            <p>{t("footer.tagline")}</p>
          </div>
          <div>
            <h3>Pilar Compass</h3>
            <p>{t("footer.compass")}</p>
            <p>
              <button type="button" className="footer-link-btn" onClick={showIntro}>
                {t("tour.replay")}
              </button>
            </p>
          </div>
          <div>
            <h3>{t("footer.info")}</h3>
            <p>
              <a
                href="https://sekolah-pilar-indonesia.sch.id/"
                target="_blank"
                rel="noreferrer"
              >
                sekolah-pilar-indonesia.sch.id
              </a>
            </p>
            <p>
              <a href="mailto:spi@pilar.sch.id">spi@pilar.sch.id</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
