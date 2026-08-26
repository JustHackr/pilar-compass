"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isValidEmail, unlockSession } from "@/lib/session";
import { isTkaOnboarded, markTkaOnboarded } from "@/lib/tka/onboardingLock";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { LocaleToggle } from "@/lib/i18n/LocaleToggle";
import { isAdminEmail } from "@/data/spi-classes";
import { logClientActivity } from "@/lib/tka/client";

type Props = {
  onUnlock: (email: string) => void;
};

export function EmailGate({ onUnlock }: Props) {
  const { t } = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function unlock(value: string) {
    if (!isValidEmail(value)) {
      setError(t("gate.error"));
      return;
    }
    const key = value.trim().toLowerCase();
    unlockSession(key);
    if (isTkaOnboarded(key)) markTkaOnboarded(key);
    const dest = isAdminEmail(key) ? "/admin" : "/";
    router.replace(dest);
    onUnlock(key);
    logClientActivity("site_unlock", dest, "Site gate unlocked");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    unlock(email);
  }

  return (
    <div className="gate-screen">
      <div className="gate-lang">
        <LocaleToggle />
      </div>
      <div className="gate-panel animate-rise">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/spi-logo.png"
          alt="Sekolah Pilar Indonesia"
          width={180}
          height={45}
          style={{ height: 45, width: "auto", marginBottom: 12 }}
        />
        <p className="eyebrow">{t("gate.eyebrow")}</p>
        <h1 className="brand-title">Pilar Compass</h1>
        <p className="lede">{t("gate.lede")}</p>
        <form onSubmit={handleSubmit} className="gate-form">
          <label htmlFor="email" className="field-label">
            {t("gate.email")}
          </label>
          <input
            ref={inputRef}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@pilar.sch.id"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="field-input"
          />
          {error ? <p className="field-error">{error}</p> : null}
          <div className="gate-actions">
            <button type="submit" className="btn-primary">
              {t("gate.unlock")}
            </button>
          </div>
        </form>
        <p className="fine-print">{t("gate.fine")}</p>
      </div>
    </div>
  );
}
