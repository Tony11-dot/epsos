import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";

// Edge-safe pre-check: if a protected /admin route is requested with NO session
// cookie at all, send to login. The authoritative signature/expiry check runs
// server-side in the dash layout (Node runtime). We deliberately do NOT bounce
// /admin/login → /admin here: mere cookie *presence* isn't validity, and pairing
// it with the layout's validity check would create a redirect loop on a stale
// cookie. The login page itself redirects away only after real verification.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const hasCookie = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  if (pathname.startsWith("/admin") && !isLogin && !hasCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
