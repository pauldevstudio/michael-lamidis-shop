import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Redirects /cms (Payload's built-in admin UI) to /admin (the custom UI).
// Also forwards the request pathname via the x-pathname header for any server
// code that may want it. NOTE: the admin shell now detects the login route
// client-side (components/admin/AdminShell.tsx via usePathname), so this header
// is no longer required for the sidebar — kept as a harmless convenience.
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
// - /cms*     gets redirected to /admin
// - /admin/*  x-pathname is set here (informational only; the admin shell detects
//             the login route client-side via usePathname)
// Public pages are intentionally excluded so middleware never disables their ISR caching.
export const config = {
  matcher: ["/admin/:path*", "/admin", "/cms/:path*", "/cms"],
};
