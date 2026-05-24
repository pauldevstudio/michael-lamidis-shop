export const runtime = "nodejs";

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;

// ── Credentials — prefer env vars in production ───────────────────────────────
// Set ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SECRET in Vercel project settings.
// The fallbacks below are only used in local dev when env vars are missing.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "michael";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Lamidis@2026";
const SESSION_SECRET = process.env.ADMIN_SECRET ?? "ml-admin-secret-2026-xK9pQ3";
// ─────────────────────────────────────────────────────────────────────────────

function safeCompare(a: string, b: string): boolean {
  const key = Buffer.alloc(32, 0);
  const ha = crypto.createHmac("sha256", key).update(a).digest();
  const hb = crypto.createHmac("sha256", key).update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function createToken(): string {
  const ts = Date.now().toString();
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(`${ts}.admin`).digest("hex");
  return `${ts}.${sig}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body ?? {};

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    if (!safeCompare(username, ADMIN_USERNAME) || !safeCompare(password, ADMIN_PASSWORD)) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const token = createToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: true, // ✅ REQUIRED FOR VERCEL
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
