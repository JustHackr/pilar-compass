"use client";

import { useEffect, useState } from "react";
import { EmailGate } from "@/components/EmailGate";
import { AppShell } from "@/components/AppShell";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import { getStoredEmail } from "@/lib/session";

export function ClientApp({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(getStoredEmail());
    setReady(true);
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
