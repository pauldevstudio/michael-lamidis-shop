import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Hide Payload's admin UI — anyone hitting /cms gets sent to /admin.
  if (pathname === "/cms" || pathname.startsWith("/cms/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // Maintenance mode: rewrite all public routes to /maintenance.
  // Admin, API, and the maintenance page itself are excluded.
  if (process.env.MAINTENANCE_MODE === "true") {
    const isExcluded =
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/maintenance") ||
      pathname.startsWith("/_next") ||
      /\.\w+$/.test(pathname);

    if (!isExcluded) {
      const url = request.nextUrl.clone();
      url.pathname = "/maintenance";
      return NextResponse.rewrite(url);
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
