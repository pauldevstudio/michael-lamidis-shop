export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE as SID_COOKIE,
  VISITOR_COOKIE as VID_COOKIE,
  classifySource,
  parseCampaignParams,
  referrerWithoutQuery,
} from "@/lib/attribution";
import { clientKey, createRateLimiter } from "@/lib/rate-limit";
import { readJsonBody } from "@/lib/request-guard";
import { analyticsAllowed, dropAnalyticsCookiesWithoutConsent } from "@/lib/visitor-attribution";

const SESSION_MS = 30 * 60 * 1000;
const VISITOR_COOKIE_SECONDS = 60 * 60 * 24 * 365;
const MAX_BODY_BYTES = 4 * 1024;
const MAX_QUERY_LENGTH = 600;
const MAX_EVENT_VALUE = 1_000_000;
const EVENTS_PER_MINUTE_PER_ADDRESS = 120;
const EVENT_NAME = /^[\w.-]{1,60}$/;
// The only events whose money value is kept. It comes from the browser, so it
// is an indication only: real order values are read from the orders collection.
const MONEY_EVENTS = new Set(["add_to_cart", "begin_checkout", "purchase"]);

const limiter = createRateLimiter(EVENTS_PER_MINUTE_PER_ADDRESS, 60 * 1000);

function deviceFromUA(ua: string): "Mobile" | "Tablet" | "Desktop" {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "Tablet";
  if (/mobi|iphone|android|ipod|blackberry|iemobile|opera mini/i.test(ua)) return "Mobile";
  return "Desktop";
}

function eventValue(raw: unknown): number {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return 0;
  return Math.min(Math.max(raw, 0), MAX_EVENT_VALUE);
}

function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  try {
    // Nothing is recorded without Analytics consent, whoever calls this. If
    // the visitor has withdrawn consent, their analytics cookies are expired.
    if (!analyticsAllowed(request)) {
      const res = noContent();
      dropAnalyticsCookiesWithoutConsent(request, res);
      return res;
    }
    if (!limiter.check(clientKey(request.headers))) return noContent();

    const read = await readJsonBody(request, MAX_BODY_BYTES);
    if (!read.ok || typeof read.body !== "object" || read.body === null) return noContent();
    const body = read.body as Record<string, unknown>;

    const kind = body.kind === "event" ? "event" : "pageview";
    const name = String(body.name || "");
    if (kind === "event" && !EVENT_NAME.test(name)) return noContent();
    // Page and referrer are stored without their query strings, so a click id
    // (fbclid, gclid) can never end up in the database.
    const path = String(body.path || "/").split(/[?#]/)[0].slice(0, 300);
    const referrer = referrerWithoutQuery(String(body.referrer || "").slice(0, 500));
    const label = String(body.label || "").slice(0, 120);
    // Landing-page query string. Only utm_* tags and the kind of click id are
    // kept (see lib/attribution.ts); the rest of the query is discarded.
    const campaign = parseCampaignParams(String(body.query || "").slice(0, MAX_QUERY_LENGTH));

    const host = request.headers.get("host")?.split(":")[0]?.replace(/^www\./, "") || "";
    const ua = request.headers.get("user-agent") || "";

    // Visitor + session ids via cookies (server-managed).
    const existingVid = request.cookies.get(VID_COOKIE)?.value;
    const vid = existingVid || crypto.randomUUID();
    const isNew = !existingVid;
    const sid = request.cookies.get(SID_COOKIE)?.value || crypto.randomUUID();

    const country = request.headers.get("x-vercel-ip-country") || "";
    const city = decodeURIComponent(request.headers.get("x-vercel-ip-city") || "");
    const region = request.headers.get("x-vercel-ip-country-region") || "";

    // Persist (best-effort; never block the response on a DB hiccup).
    try {
      const { connectDB } = await import("@/lib/db");
      const conn = await connectDB();
      if (conn) {
        const { AnalyticsEventModel } = await import("@/lib/models");
        await AnalyticsEventModel.create({
          ts: new Date(),
          vid, sid, kind, name: kind === "event" ? name : "", path, referrer,
          source: classifySource(referrer, campaign, host),
          device: deviceFromUA(ua),
          country, city, region, label, isNew,
          ...campaign,
          value: MONEY_EVENTS.has(name) ? eventValue(body.value) : 0,
        });
      }
    } catch { /* swallow — analytics must never break the page */ }

    const res = noContent();
    // 12 months, as stated in the cookie policy (app/cookie-policy/page.tsx).
    res.cookies.set(VID_COOKIE, vid, { httpOnly: true, sameSite: "lax", secure: true, maxAge: VISITOR_COOKIE_SECONDS, path: "/" });
    res.cookies.set(SID_COOKIE, sid, { httpOnly: true, sameSite: "lax", secure: true, maxAge: SESSION_MS / 1000, path: "/" });
    return res;
  } catch {
    return noContent();
  }
}
