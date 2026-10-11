/**
 * Looks up where a visitor came from, so an order or message can be tied to
 * the campaign that brought the customer.
 *
 * Rule: the most recent visit that carried campaign tags within the last 30
 * days; otherwise the channel of the current session (see pickAttribution).
 *
 * Consent: the lookup runs only while the visitor's consent cookie allows
 * Analytics. A visitor who never accepted, or who later withdrew, is not
 * looked up, and their analytics cookies are expired. No visitor or session
 * id is ever copied onto an order or message. Best effort: never throws.
 */
import type { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, VISITOR_COOKIE, pickAttribution, type Attribution } from "@/lib/attribution";
import { CONSENT_COOKIE, parseConsentValue } from "@/lib/consent-core";

const LOOKBACK_MS = 30 * 24 * 60 * 60 * 1000;
const ID_PATTERN = /^[\w-]{8,64}$/;

function cookieId(request: NextRequest, name: string): string {
  const value = request.cookies.get(name)?.value ?? "";
  return ID_PATTERN.test(value) ? value : "";
}

/** True only while the visitor's consent cookie allows Analytics. */
export function analyticsAllowed(request: NextRequest): boolean {
  return parseConsentValue(request.cookies.get(CONSENT_COOKIE)?.value).analytics;
}

/**
 * Expire the analytics cookies of a visitor who has not allowed Analytics or
 * has withdrawn it. Page scripts cannot do this because the cookies are
 * HttpOnly, so every public endpoint does it on the way out.
 */
export function dropAnalyticsCookiesWithoutConsent(request: NextRequest, response: NextResponse): void {
  if (analyticsAllowed(request)) return;
  for (const name of [VISITOR_COOKIE, SESSION_COOKIE]) {
    if (request.cookies.has(name)) response.cookies.delete(name);
  }
}

export async function lookupAttribution(request: NextRequest): Promise<Attribution | null> {
  if (!analyticsAllowed(request)) return null;
  const vid = cookieId(request, VISITOR_COOKIE);
  if (!vid) return null;
  const sid = cookieId(request, SESSION_COOKIE);

  try {
    const { connectDB } = await import("@/lib/db");
    const conn = await connectDB();
    if (!conn) return null;
    const { AnalyticsEventModel } = await import("@/lib/models");

    const since = new Date(Date.now() - LOOKBACK_MS);
    const [campaignTouch, sessionStart, firstEvent] = await Promise.all([
      // `$gt: ""` matches non-empty strings only, so events saved before the
      // campaign fields existed are skipped.
      AnalyticsEventModel.findOne({
        vid,
        ts: { $gte: since },
        $or: [{ utmSource: { $gt: "" } }, { utmMedium: { $gt: "" } }, { clickId: { $gt: "" } }],
      }).sort({ ts: -1 }).lean(),
      sid ? AnalyticsEventModel.findOne({ vid, sid }).sort({ ts: 1 }).lean() : null,
      AnalyticsEventModel.findOne({ vid }).sort({ ts: 1 }).lean(),
    ]);

    return pickAttribution(campaignTouch, sessionStart, firstEvent);
  } catch (err) {
    console.error("[attribution] lookup failed:", err instanceof Error ? err.name : "unknown error");
    return null;
  }
}
