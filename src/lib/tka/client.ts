import { getStoredEmail } from "@/lib/session";
import { ACCOUNT_HEADER } from "@/lib/tka/account";

export function tkaFetchInit(init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers);
  headers.set(ACCOUNT_HEADER, getStoredEmail() ?? "");
  if (!headers.has("Cache-Control")) headers.set("Cache-Control", "no-store");
  return { ...init, headers };
}

/** POST activity without Next's no-store fetch cache, which can refetch the current RSC page. */
export function logClientActivity(
  type: string,
  path: string,
  detail?: string,
): void {
  const headers = new Headers();
  headers.set(ACCOUNT_HEADER, getStoredEmail() ?? "");
  headers.set("Content-Type", "application/json");
  void fetch("/api/activity", {
    method: "POST",
    headers,
    body: JSON.stringify({ type, path, detail }),
    keepalive: true,
  });
}
