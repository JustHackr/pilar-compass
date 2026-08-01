"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { hasSeenTour, markTourSeen } from "@/lib/tour";

const STEPS = ["welcome", "comps", "calc"] as const;

type Props = {
  forceOpen?: boolean;
  onClose?: () => void;
};

export function OnboardingTour({ forceOpen = false, onClose }: Props) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
      setStep(0);
      return;
    }
    if (!hasSeenTour()) setOpen(true);
  }, [forceOpen]);

  function finish() {
    markTourSeen();
    setOpen(false);
    onClose?.();
  }

  function next() {
    if (step >= STEPS.length - 1) {
      finish();
      return;
    }
    setStep((s) => s + 1);
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  if (!open) return null;

  const key = STEPS[step];

  return (
    <div className="tour-overlay" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div className="tour-card animate-rise">
        <p className="eyebrow">{t("tour.kicker")}</p>
        <h2 id="tour-title">{t(`tour.${key}.title`)}</h2>
        <p className="tour-body">{t(`tour.${key}.body`)}</p>

        <ol className="tour-dots" aria-label="Steps">
          {STEPS.map((s, i) => (
            <li key={s} className={i === step ? "active" : i < step ? "done" : ""}>
              <button type="button" onClick={() => setStep(i)} aria-label={`Step ${i + 1}`} />
            </li>
          ))}
        </ol>

        <div className="tour-actions">
          {step > 0 ? (
            <button type="button" className="btn-secondary" onClick={back}>
              {t("tour.back")}
            </button>
          ) : (
            <button type="button" className="btn-ghost" onClick={finish}>
              {t("tour.skip")}
            </button>
          )}
          <button type="button" className="btn-primary" onClick={next}>
            {step >= STEPS.length - 1 ? t("tour.done") : t("tour.next")}
          </button>
        </div>
      </div>
    </div>
  );
}
