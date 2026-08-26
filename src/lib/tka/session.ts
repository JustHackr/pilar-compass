import { isValidEmail } from "@/lib/session";
import { ACCOUNT_HEADER } from "@/lib/tka/account";

export function claimedEmailFrom(req: Request): string {
  return (req.headers.get(ACCOUNT_HEADER) ?? "").toLowerCase().trim();
}

export async function requireAccountEmail(req: Request): Promise<string | null> {
  const claimed = claimedEmailFrom(req);
  if (!isValidEmail(claimed)) return null;
  return claimed;
}
