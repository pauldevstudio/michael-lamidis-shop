/**
 * Full NextAuth config (Node runtime). Extends the slim authConfig with the
 * Credentials provider that hits Mongoose. Used by route handlers and RSCs.
 */
import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { loginSchema } from "@/lib/validation";
import { authConfig } from "@/lib/auth.config";

declare module "next-auth" {
  interface Session {
    user: { id: string; email: string; name: string; role: "admin" } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        await connectDB();
        const user = await UserModel.findOne({ email: parsed.data.email }).lean();
        if (!user) return null;

        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: "admin" as const,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = "admin";
      }
      return session;
    },
  },
});
