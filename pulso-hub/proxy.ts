import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth.js session cookie names (v5).
const SESSION_COOKIES = ["authjs.session-token", "__Secure-authjs.session-token"];

export function proxy(req: NextRequest) {
  // Demo mode: when Google OAuth isn't configured, the hub stays open with mock data.
  const configured = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_SECRET);
  if (!configured) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const hasSession = SESSION_COOKIES.some((c) => req.cookies.has(c));
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png).*)"],
};
