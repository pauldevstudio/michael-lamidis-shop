export const runtime = "nodejs";

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

// ── Credentials — MUST be set via env vars ───────────────────────────────────
// No fallback values: if any are missing the login route fails closed.
function getEnv() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret   = process.env.ADMIN_SECRET;
  if (!username || !password || !secret) return null;
  return { username, password, secret };
}

function safeCompare(a: string, b: string): boolean {
  const key = Buffer.alloc(32, 0);
  const ha = crypto.createHmac("sha256", key).update(a).digest();
  const hb = crypto.createHmac("sha256", key).update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function createToken(secret: string): string {
  const ts = Date.now().toString();
  const sig = crypto.createHmac("sha256", secret).update(`${ts}.admin`).digest("hex");
  return `${ts}.${sig}`;
}

// ── Rate limiting (in-memory, per-IP) ─────────────────────────────────────────
// Allows max 5 failed attempts per IP per 60s rolling window.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
type Bucket = { count: number; resetAt: number };
const attemptBuckets = new Map<string, Bucket>();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = attemptBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    attemptBuckets.set(ip, { count: 0, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (bucket.count >= RATE_MAX) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfterSec: 0 };
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const bucket = attemptBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    attemptBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
  } else {
    bucket.count++;
  }
}

// ── Handler ──────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const env = getEnv();
    if (!env) {
      console.error("[admin/login] ADMIN_USERNAME / ADMIN_PASSWORD / ADMIN_SECRET env vars missing - login disabled");
      return NextResponse.json(
        { error: "Login temporarily unavailable" },
        { status: 503 },
      );
    }

    const ip = getClientIp(request);
    const rate = checkRateLimit(ip);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${rate.retryAfterSec}s.` },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSec) } },
      );
    }

    const body = await request.json();
    const { username, password } = body ?? {};

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
      recordFailedAttempt(ip);
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    if (!safeCompare(username, env.username) || !safeCompare(password, env.password)) {
      recordFailedAttempt(ip);
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const token = createToken(env.secret);
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
