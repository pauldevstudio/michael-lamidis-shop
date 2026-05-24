/**
 * Edge-runtime middleware. Uses the slim auth.config (no DB) so it
 * doesn't try to load Mongoose, which would crash in Edge.
 * Real credential validation happens in lib/auth.ts on the Node runtime.
 */
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isAdmin = req.nextUrl.pathname.startsWith("/admin");
  if (isAdmin && !req.auth) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("from", req.nextUrl.pathname);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
