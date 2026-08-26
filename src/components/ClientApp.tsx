"use client";

import { useEffect, useState } from "react";
import { EmailGate } from "@/components/EmailGate";
import { AppShell } from "@/components/AppShell";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import { EMAIL_KEY, restoreStoredEmail } from "@/lib/session";
import { isTkaOnboarded, markTkaOnboarded } from "@/lib/tka/onboardingLock";

export function ClientApp({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- localStorage is only available after mount */
    function syncFromStorage(clearIfMissing: boolean) {
      const stored = restoreStoredEmail();
      if (stored) {
        if (isTkaOnboarded(stored)) markTkaOnboarded(stored);
        setEmail(stored);
      } else if (clearIfMissing) setEmail(null);
    }
    syncFromStorage(true);
    setReady(true);

    function onFocus() {
      syncFromStorage(false);
    }
    function onStorage(event: StorageEvent) {
      if (event.key && event.key !== EMAIL_KEY) return;
      syncFromStorage(true);
    }
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!ready) {
    return <div className="boot-screen" aria-hidden />;
  }

  return (
    <LocaleProvider>
      {!email ? (
        <EmailGate onUnlock={setEmail} />
      ) : (
        <AppShell email={email} onSignOut={() => setEmail(null)}>
          {children}
        </AppShell>
      )}
    </LocaleProvider>
  );
}
