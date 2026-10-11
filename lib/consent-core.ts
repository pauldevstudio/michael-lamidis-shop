/**
 * Cookie-consent rules shared by the browser and the server. Pure functions,
 * no imports, so `node --test` can load this file directly and server code can
 * use it without touching the client-only React module (lib/cookie-consent.tsx).
 */

export const CONSENT_COOKIE = "cookie_consent";
// Bump whenever the cookie or privacy wording changes in a way visitors should
// be asked about again. 2 (October 2026): the banner and the cookie policy now
// name the Meta Pixel, and Analytics also covers which advert brought an order
// or message. The inline script in app/layout.tsx reads this constant too.
export const CONSENT_VERSION = 2;

export interface ConsentFlags {
  analytics: boolean;
  marketing: boolean;
}

export const NO_CONSENT: ConsentFlags = Object.freeze({ analytics: false, marketing: false });

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function decode(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
}

/**
 * Read the value of the consent cookie (URL-encoded or already decoded).
 * Anything missing, malformed or saved under an older policy version means
 * no consent.
 */
export function parseConsentValue(raw: string | null | undefined): ConsentFlags {
  if (!raw) return NO_CONSENT;
  const parsed = parseJson(raw) ?? parseJson(decode(raw));
  if (typeof parsed !== "object" || parsed === null) return NO_CONSENT;
  const record = parsed as Record<string, unknown>;
  if (record.v !== CONSENT_VERSION) return NO_CONSENT;
  return { analytics: record.analytics === true, marketing: record.marketing === true };
}

/** Find the consent cookie in a `document.cookie` style string. */
export function consentFromCookieString(cookieString: string): ConsentFlags {
  const prefix = `${CONSENT_COOKIE}=`;
  const hit = cookieString.split("; ").find((cookie) => cookie.startsWith(prefix));
  return hit ? parseConsentValue(hit.slice(prefix.length)) : NO_CONSENT;
}
