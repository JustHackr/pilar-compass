"use client";

import {
  createContext,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredEmail } from "@/lib/session";
import { useLocale } from "@/lib/i18n/LocaleContext";
import type { SkillMastery, TkaProfile } from "@/lib/tka/types";

export type TkaMe = {
  email: string;
  profile: TkaProfile | null;
  today: {
    lessonsCompleted: number;
    tryoutsSubmitted: number;
    xpEarned: number;
    streakCounted: boolean;
  };
  monthXp: number;
  monthScore: number;
  mastery: SkillMastery[];
};

const TkaMeContext = createContext<{
  me: TkaMe;
  reload: () => Promise<void>;
} | null>(null);

export function useTkaMe() {
  const ctx = useContext(TkaMeContext);
  if (!ctx) throw new Error("useTkaMe outside TkaGate");
  return ctx;
}

export function TkaGate({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<TkaMe | null>(null);
  const [needVerify, setNeedVerify] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadMe = useCallback(async () => {
    const res = await fetch("/api/tka/me");
    if (res.status === 401) {
      setNeedVerify(true);
      setMe(null);
      return;
    }
    if (!res.ok) return;
    const data = (await res.json()) as TkaMe;
    setNeedVerify(false);
    setMe(data);
    if (!data.profile?.onboardingCompletedAt && pathname !== "/tka/onboarding") {
      router.replace("/tka/onboarding");
    }
  }, [pathname, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async session fetch
    void loadMe();
  }, [loadMe]);

  async function sendCode(e: FormEvent) {
    e.preventDefault();
    const target = email || getStoredEmail() || "";
    setEmail(target);
    setBusy(true);
    setError("");
    const res = await fetch("/api/tka/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: target }),
    });
    const data = (await res.json()) as { devCode?: string };
    setBusy(false);
    if (!res.ok) {
      setError(t("tka.verify.error"));
      return;
    }
    if (data.devCode) setDevCode(data.devCode);
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/tka/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    setBusy(false);
    if (!res.ok) {
      setError(t("tka.verify.error"));
      return;
    }
    await loadMe();
  }

  if (needVerify) {
    return (
      <div className="page-wrap tka-page">
        <p className="eyebrow">{t("tka.hub.eyebrow")}</p>
        <h1>{t("tka.verify.title")}</h1>
        <p className="lede">{t("tka.verify.body")}</p>
        <form className="tka-form" onSubmit={sendCode}>
          <label className="field-label" htmlFor="tka-email">
            {t("gate.email")}
          </label>
          <input
            id="tka-email"
            className="field-input"
            type="email"
            value={email}
            placeholder={getStoredEmail() ?? "name@example.com"}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn-secondary" type="submit" disabled={busy}>
            {t("tka.verify.send")}
          </button>
        </form>
        {devCode ? (
          <p className="tka-otp-reveal" role="status">
            {t("tka.verify.sent", { code: devCode })}
          </p>
        ) : null}
        <form className="tka-form" onSubmit={verify}>
          <label className="field-label" htmlFor="tka-code">
            {t("tka.verify.code")}
          </label>
          <input
            id="tka-code"
            className="field-input"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          {error ? <p className="field-error">{error}</p> : null}
          <button className="btn-primary" type="submit" disabled={busy}>
            {t("tka.verify.submit")}
          </button>
        </form>
      </div>
    );
  }

  if (!me) {
    return <div className="page-wrap tka-page" aria-busy="true" />;
  }

  if (!me.profile?.onboardingCompletedAt && pathname !== "/tka/onboarding") {
    return <div className="page-wrap tka-page" aria-busy="true" />;
  }

  return (
    <TkaMeContext.Provider value={{ me, reload: loadMe }}>
      {children}
    </TkaMeContext.Provider>
  );
}
