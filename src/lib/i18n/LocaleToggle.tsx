"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Locale } from "@/lib/i18n/dictionaries";

export function LocaleToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  function pick(next: Locale) {
    setLocale(next);
  }

  return (
    <div className={`locale-toggle ${className}`.trim()} role="group" aria-label="Language">
      <button
        type="button"
        className={locale === "en" ? "locale-btn active" : "locale-btn"}
        onClick={() => pick("en")}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        type="button"
        className={locale === "id" ? "locale-btn active" : "locale-btn"}
        onClick={() => pick("id")}
        aria-pressed={locale === "id"}
      >
        ID
      </button>
    </div>
  );
}
