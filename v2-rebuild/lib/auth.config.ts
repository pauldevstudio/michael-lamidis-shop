/**
 * Edge-safe NextAuth config. No DB imports — this is what middleware uses.
 * The full config in lib/auth.ts extends this with providers + Mongoose lookup.
 */
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isAdmin = request.nextUrl.pathname.startsWith("/admin");
      if (!isAdmin) return true;
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
