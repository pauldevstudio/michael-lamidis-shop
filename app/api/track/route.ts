export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const VID_COOKIE = "_av"; // anonymous visitor id (2 years)
const SID_COOKIE = "_as"; // session id (30 min sliding)
const SESSION_MS = 30 * 60 * 1000;

function deviceFromUA(ua: string): "Mobile" | "Tablet" | "Desktop" {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "Tablet";
  if (/mobi|iphone|android|ipod|blackberry|iemobile|opera mini/i.test(ua)) return "Mobile";
  return "Desktop";
}

function classifySource(referrer: string, path: string, host: string): string {
  const q = (path.split("?")[1] || "").toLowerCase();
  if (/gclid=|utm_medium=cpc|utm_medium=paid|utm_medium=ppc/.test(q)) return "Paid Advertising";
  if (!referrer) return "Direct";
  let r = "";
  try { r = new URL(referrer).hostname.toLowerCase(); } catch { return "Direct"; }
  if (!r || r === host || r.endsWith("." + host)) return "Direct";
  if (/(google|bing|yahoo|duckduckgo|ecosia|yandex|baidu)\./.test(r)) return "Organic Search";
  if (/(facebook|fb\.|instagram|t\.co|twitter|x\.com|linkedin|youtube|tiktok|pinterest|reddit|whatsapp)\./.test(r)) return "Social Media";
  return "Referral";
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown> = {};
    try { body = JSON.parse(await request.text()); } catch { /* empty */ }

    const kind = body.kind === "event" ? "event" : "pageview";
    const path = String(body.path || "/").slice(0, 300);
    const referrer = String(body.referrer || "").slice(0, 500);
    const name = String(body.name || "").slice(0, 80);
    const label = String(body.label || "").slice(0, 120);

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
          vid, sid, kind, name, path, referrer,
          source: classifySource(referrer, path, host.replace(/^www\./, "")),
          device: deviceFromUA(ua),
          country, city, region, label, isNew,
        });
      }
    } catch { /* swallow — analytics must never break the page */ }

    const res = new NextResponse(null, { status: 204 });
    res.cookies.set(VID_COOKIE, vid, { httpOnly: true, sameSite: "lax", secure: true, maxAge: 60 * 60 * 24 * 730, path: "/" });
    res.cookies.set(SID_COOKIE, sid, { httpOnly: true, sameSite: "lax", secure: true, maxAge: SESSION_MS / 1000, path: "/" });
    return res;
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
