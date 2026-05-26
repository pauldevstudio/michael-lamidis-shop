import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Forwards the current pathname to server components via the x-pathname header.
// Also redirects /cms (Payload's built-in admin UI) to /admin (the custom UI).
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Hide Payload's admin UI — anyone hitting /cms gets sent to /admin.
  // Payload's Local API still works (used internally by /admin).
  // To temporarily re-enable Payload's UI, comment out this block.
  if (pathname === "/cms" || pathname.startsWith("/cms/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

// Only run middleware on admin + cms routes:
// - /admin/*  needs the x-pathname header for admin/layout.tsx's login-page detection
// - /cms*     gets redirected to /admin
// Public pages don't need either, and matching them prevents ISR from caching.
export const config = {
  matcher: ["/admin/:path*", "/admin", "/cms/:path*", "/cms"],
};
