import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== "/tka/onboarding") return NextResponse.next();
  const email = decodeURIComponent(req.cookies.get("pilar_compass_email")?.value ?? "")
    .toLowerCase()
    .trim();
  const done = decodeURIComponent(req.cookies.get("pilar_tka_done")?.value ?? "")
    .toLowerCase()
    .trim();
  if (email && done && email === done) {
    return NextResponse.redirect(new URL("/tka", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/tka/onboarding",
};
