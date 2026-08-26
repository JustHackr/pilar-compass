"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { isAdminEmail } from "@/data/spi-classes";
import { getStoredEmail } from "@/lib/session";
import { tkaFetchInit } from "@/lib/tka/client";
import { preferOnboardedMe, tkaGateRedirect } from "@/lib/tka/gate";
import {
  blankMe,
  emptyOnboardedMe,
  isTkaOnboarded,
  markTkaOnboarded,
} from "@/lib/tka/onboardingLock";
import { readCachedMe, writeCachedMe } from "@/lib/tka/profileCache";
import type { TkaPublicMe } from "@/lib/tka/types";

export type TkaMe = TkaPublicMe;

const TkaMeContext = createContext<{
  me: TkaMe;
  reload: () => Promise<void>;
} | null>(null);

export function useTkaMe() {
  const ctx = useContext(TkaMeContext);
  if (!ctx) throw new Error("useTkaMe outside TkaGate");
  return ctx;
}

function tkaFinished(email: string, profile: TkaMe["profile"]): boolean {
  return isAdminEmail(email) || isTkaOnboarded(email) || Boolean(profile?.onboardingCompletedAt);
}

function keepFinishedMe(email: string, cached: TkaMe | null, server: TkaMe | null): TkaMe {
  const merged = server ? preferOnboardedMe(server, cached) : cached;
  if (merged?.profile?.onboardingCompletedAt) return merged;
  if (cached?.profile?.onboardingCompletedAt) return cached;
  if (tkaFinished(email, null)) return cached ?? emptyOnboardedMe(email);
  return merged ?? blankMe(email);
}

async function restoreServerProfile(cached: TkaMe): Promise<boolean> {
  const profile = cached.profile;
  if (!profile?.onboardingCompletedAt) return false;
  const res = await fetch(
    "/api/tka/onboarding",
    tkaFetchInit({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: profile.displayName,
        age: profile.age,
        tkaTrack: profile.tkaTrack,
        kelas: profile.kelas,
        pilihanIds: profile.pilihanIds,
      }),
    }),
  );
  return res.ok;
}

export function TkaGate({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const { t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<TkaMe | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const loadSeq = useRef(0);

  const loadMe = useCallback(async () => {
    const seq = ++loadSeq.current;
    const email = (getStoredEmail() ?? "").toLowerCase().trim();
    const cached = email ? readCachedMe(email) : null;
    if (cached?.profile?.onboardingCompletedAt) {
      markTkaOnboarded(email);
      setMe(cached);
      setLoadError(false);
    } else if (email && isTkaOnboarded(email)) {
      setMe(emptyOnboardedMe(email));
      setLoadError(false);
    }

    const res = await fetch("/api/tka/me", {
      ...tkaFetchInit(),
      cache: "no-store",
    });
    if (seq !== loadSeq.current) return;
    if (!res.ok) {
      if (cached || (email && isTkaOnboarded(email))) return;
      setLoadError(true);
      return;
    }
    const server = (await res.json()) as TkaMe;
    if (seq !== loadSeq.current) return;
    let data = keepFinishedMe(email || server.email, cached, server);
    if (cached?.profile?.onboardingCompletedAt && !server.profile?.onboardingCompletedAt) {
      const restored = await restoreServerProfile(cached);
      if (seq !== loadSeq.current) return;
      if (restored) {
        const again = await fetch("/api/tka/me", {
          ...tkaFetchInit(),
          cache: "no-store",
        });
        if (again.ok) {
          data = keepFinishedMe(email || server.email, cached, (await again.json()) as TkaMe);
        }
      }
    }
    if (data.profile?.onboardingCompletedAt) {
      markTkaOnboarded(data.email);
      writeCachedMe(data);
    }
    if (tkaFinished(data.email, data.profile) && !data.profile?.onboardingCompletedAt) {
      data = keepFinishedMe(data.email, cached, data);
    }
    setMe(data);
    setLoadError(false);
    if (requireAdmin && !isAdminEmail(data.email)) {
      setForbidden(true);
      return;
    }
    setForbidden(false);
  }, [requireAdmin]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async session fetch
    void loadMe();
  }, [loadMe]);

  const finished = Boolean(me && tkaFinished(me.email, me.profile));

  useEffect(() => {
    if (!me || forbidden) return;
    const dest = tkaGateRedirect({
      pathname,
      email: me.email,
      onboarded: tkaFinished(me.email, me.profile),
    });
    if (dest) router.replace(dest);
  }, [forbidden, me, pathname, router]);

  if (forbidden) {
    return (
      <div className="page-wrap tka-page">
        <p className="eyebrow">{t("admin.verify.eyebrow")}</p>
        <h1>{t("admin.forbidden.title")}</h1>
        <p className="lede">{t("admin.forbidden.body")}</p>
      </div>
    );
  }

  if (loadError && !me) {
    return (
      <div className="page-wrap tka-page">
        <p className="eyebrow">{t("tka.hub.eyebrow")}</p>
        <h1>{t("tka.hub.title")}</h1>
        <p className="lede">{t("tka.loadError")}</p>
        <button type="button" className="btn-primary" onClick={() => void loadMe()}>
          {t("admin.refresh")}
        </button>
      </div>
    );
  }

  if (!me) {
    return <div className="page-wrap tka-page" aria-busy="true" />;
  }

  if (finished && pathname === "/tka/onboarding") {
    return <div className="page-wrap tka-page" aria-busy="true" />;
  }

  return (
    <TkaMeContext.Provider value={{ me, reload: loadMe }}>
      {children}
    </TkaMeContext.Provider>
  );
}
