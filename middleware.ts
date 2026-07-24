import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/cms" || pathname.startsWith("/cms/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/cms/:path*", "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|ico|svg|webp|avif|woff|woff2|mp4|webm)$).*)"],
};
