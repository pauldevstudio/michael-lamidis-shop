/**
 * Admin authentication — Node.js runtime only.
 * Session tokens are HMAC-SHA256 signed and time-limited to 24 h.
 * Token format: "{unix_ms}.{hmac_hex_64}"
 */
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// SESSION_SECRET must come from ADMIN_SECRET env var - no source-code fallback.
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Creates a new signed session token — call this on successful login. */
export function createSessionToken(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return "";  // no env → cannot create token
  const ts = Date.now().toString();
  const sig = crypto
    .createHmac("sha256", secret)
    .update(`${ts}.admin`)
    .digest("hex");
  return `${ts}.${sig}`;
}

/** Verifies a session token — returns true only when HMAC is valid and token is under 24 h old. */
export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;

  try {
    const secret = process.env.ADMIN_SECRET;
    if (!secret) return false;  // no env → no valid tokens
    const dot = token.indexOf(".");
    if (dot === -1) return false;

    const ts = token.slice(0, dot);
    const sig = token.slice(dot + 1);

    if (!/^\d{13}$/.test(ts) || !/^[0-9a-f]{64}$/.test(sig)) return false;

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${ts}.admin`)
      .digest("hex");

    const sigBuf = Buffer.from(sig, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) return false;

    const validSig = crypto.timingSafeEqual(sigBuf, expBuf);
    const age = Date.now() - parseInt(ts, 10);
    const validAge = age >= 0 && age < SESSION_MAX_AGE_MS;

    return validSig && validAge;
  } catch {
    return false;
  }
}

/** Server-component guard — redirects to /admin/login if session is missing or invalid. */
export async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!isValidSessionToken(session?.value)) {
    redirect("/admin/login");
  }
}
