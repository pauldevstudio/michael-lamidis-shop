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

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
