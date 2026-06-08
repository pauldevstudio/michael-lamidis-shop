/**
 * Analytics data source for the admin dashboard.
 *
 * Returns a single normalized shape (`AnalyticsData`) that the dashboard UI
 * renders. When GA4 service-account credentials are configured it pulls live
 * data from the GA4 Data API; otherwise it returns clearly-labeled, realistic
 * SAMPLE data (`source: "sample"`) so the dashboard is fully demonstrable
 * before GA4 is connected. See ANALYTICS_SETUP.md.
 *
 * Required env to go live (server-side only — never exposed to the client):
 *   GA4_PROPERTY_ID     numeric GA4 property id, e.g. 123456789
 *   GA4_CLIENT_EMAIL    service-account email
 *   GA4_PRIVATE_KEY     service-account private key (\n-escaped)
 */
import crypto from "crypto";

export type RangeKey = "today" | "7d" | "30d" | "90d";

export interface AnalyticsData {
  source: "ga4" | "sample" | "live";
  range: RangeKey;
  generatedAt: string;
  note?: string;
  overview: {
    totalVisitors: number;
    uniqueVisitors: number;
    returningVisitors: number;
    visitorsToday: number;
    visitorsThisWeek: number;
    visitorsThisMonth: number;
    pageViews: number;
    avgSessionDuration: number; // seconds
    bounceRate: number; // 0-100
  };
  trend: { date: string; visitors: number }[];
  trafficSources: { label: string; sessions: number; pct: number }[];
  topPages: { path: string; views: number; avgTime: number }[];
  locations: { country: string; city: string; region: string; visitors: number }[];
  devices: { device: string; sessions: number; pct: number }[];
  clicks: {
    totalClicks: number;
    items: { label: string; type: string; count: number }[];
    channels: { phone: number; email: number; whatsapp: number; formSubmissions: number };
  };
  behavior: {
    entryPages: { path: string; count: number }[];
    exitPages: { path: string; count: number }[];
    bounceRate: number;
    funnel: { step: string; visitors: number }[];
  };
}

const RANGE_DAYS: Record<RangeKey, number> = { today: 1, "7d": 7, "30d": 30, "90d": 90 };

function pct(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 1000) / 10 : 0;
}

// ── Zero baseline (shown until GA4 returns live data) ───────────────────────
// Keeps the full dashboard structure (KPI cards, chart axis, category labels,
// funnel steps) but every value is 0 / empty — no fabricated numbers. Real
// figures overlay this once GA4 is connected.
function sampleData(range: RangeKey): AnalyticsData {
  const days = RANGE_DAYS[range];

  // Keep the time-axis buckets so the chart renders a flat baseline, all zero.
  const trend =
    range === "today"
      ? Array.from({ length: 24 }, (_, h) => ({ date: `${String(h).padStart(2, "0")}:00`, visitors: 0 }))
      : Array.from({ length: Math.min(days, 30) }, (_, i) => {
          const points = Math.min(days, 30);
          const d = new Date();
          d.setDate(d.getDate() - (points - 1 - i));
          return { date: d.toISOString().slice(5, 10), visitors: 0 };
        });

  return {
    source: "sample",
    range,
    generatedAt: new Date().toISOString(),
    note: "No live data yet — connects automatically once GA4 access is active.",
    overview: {
      totalVisitors: 0,
      uniqueVisitors: 0,
      returningVisitors: 0,
      visitorsToday: 0,
      visitorsThisWeek: 0,
      visitorsThisMonth: 0,
      pageViews: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
    },
    trend,
    trafficSources: [
      { label: "Organic Search", sessions: 0, pct: 0 },
      { label: "Direct", sessions: 0, pct: 0 },
      { label: "Social Media", sessions: 0, pct: 0 },
      { label: "Referral", sessions: 0, pct: 0 },
      { label: "Paid Advertising", sessions: 0, pct: 0 },
    ],
    topPages: [],
    locations: [],
    devices: [
      { device: "Desktop", sessions: 0, pct: 0 },
      { device: "Mobile", sessions: 0, pct: 0 },
      { device: "Tablet", sessions: 0, pct: 0 },
    ],
    clicks: {
      totalClicks: 0,
      items: [],
      channels: { phone: 0, email: 0, whatsapp: 0, formSubmissions: 0 },
    },
    behavior: {
      entryPages: [],
      exitPages: [],
      bounceRate: 0,
      funnel: [
        { step: "Landing", visitors: 0 },
        { step: "Viewed Products", visitors: 0 },
        { step: "Viewed a Product", visitors: 0 },
        { step: "Reached Contact", visitors: 0 },
        { step: "Enquiry (call/WA/form)", visitors: 0 },
      ],
    },
  };
}

// ── GA4 Data API (live) ─────────────────────────────────────────────────────
function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const signature = b64url(signer.sign(privateKey.replace(/\\n/g, "\n")));
  const jwt = `${header}.${claim}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(`GA4 token error ${res.status}`);
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

async function fetchFromGA4(range: RangeKey): Promise<AnalyticsData> {
  const propertyId = process.env.GA4_PROPERTY_ID!;
  const token = await getAccessToken(process.env.GA4_CLIENT_EMAIL!, process.env.GA4_PRIVATE_KEY!);
  const startDate = `${RANGE_DAYS[range]}daysAgo`;
  const dateRanges = [{ startDate, endDate: "today" }];

  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({
        requests: [
          { dateRanges, metrics: [{ name: "totalUsers" }, { name: "newUsers" }, { name: "screenPageViews" }, { name: "averageSessionDuration" }, { name: "bounceRate" }] },
          { dateRanges, dimensions: [{ name: "sessionDefaultChannelGroup" }], metrics: [{ name: "sessions" }], orderBys: [{ metric: { metricName: "sessions" }, desc: true }] },
          { dateRanges, dimensions: [{ name: "pagePath" }], metrics: [{ name: "screenPageViews" }, { name: "userEngagementDuration" }], orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }], limit: "8" },
          { dateRanges, dimensions: [{ name: "deviceCategory" }], metrics: [{ name: "sessions" }] },
          { dateRanges, dimensions: [{ name: "country" }, { name: "city" }, { name: "region" }], metrics: [{ name: "totalUsers" }], orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }], limit: "8" },
          { dateRanges, dimensions: [{ name: "eventName" }], metrics: [{ name: "eventCount" }], orderBys: [{ metric: { metricName: "eventCount" }, desc: true }], limit: "20" },
        ],
      }),
    },
  );
  if (!res.ok) throw new Error(`GA4 report error ${res.status}`);
  const data = (await res.json()) as { reports: Ga4Report[] };
  return mapGA4(range, data.reports);
}

interface Ga4Row { dimensionValues?: { value: string }[]; metricValues?: { value: string }[]; }
interface Ga4Report { rows?: Ga4Row[]; }

function mapGA4(range: RangeKey, reports: Ga4Report[]): AnalyticsData {
  // Start from the sample skeleton so any report GA4 doesn't return still
  // renders sensibly, then overlay the live figures we did fetch.
  const out = sampleData(range);
  out.source = "ga4";
  out.note = undefined;

  const num = (v?: string) => Math.round(Number(v ?? 0));

  const ov = reports[0]?.rows?.[0]?.metricValues;
  if (ov) {
    out.overview.totalVisitors = num(ov[0]?.value);
    const newUsers = num(ov[1]?.value);
    out.overview.uniqueVisitors = newUsers;
    out.overview.returningVisitors = Math.max(0, out.overview.totalVisitors - newUsers);
    out.overview.pageViews = num(ov[2]?.value);
    out.overview.avgSessionDuration = Math.round(Number(ov[3]?.value ?? 0));
    out.overview.bounceRate = Math.round(Number(ov[4]?.value ?? 0) * 1000) / 10;
  }

  const chRows = reports[1]?.rows ?? [];
  if (chRows.length) {
    const total = chRows.reduce((a, r) => a + num(r.metricValues?.[0]?.value), 0);
    out.trafficSources = chRows.map((r) => {
      const s = num(r.metricValues?.[0]?.value);
      return { label: r.dimensionValues?.[0]?.value ?? "Other", sessions: s, pct: pct(s, total) };
    });
  }

  const pgRows = reports[2]?.rows ?? [];
  if (pgRows.length) {
    out.topPages = pgRows.map((r) => {
      const views = num(r.metricValues?.[0]?.value);
      const eng = Number(r.metricValues?.[1]?.value ?? 0);
      return { path: r.dimensionValues?.[0]?.value ?? "/", views, avgTime: views ? Math.round(eng / views) : 0 };
    });
  }

  const dvRows = reports[3]?.rows ?? [];
  if (dvRows.length) {
    const total = dvRows.reduce((a, r) => a + num(r.metricValues?.[0]?.value), 0);
    out.devices = dvRows.map((r) => {
      const s = num(r.metricValues?.[0]?.value);
      const name = r.dimensionValues?.[0]?.value ?? "";
      return { device: name.charAt(0).toUpperCase() + name.slice(1), sessions: s, pct: pct(s, total) };
    });
  }

  const locRows = reports[4]?.rows ?? [];
  if (locRows.length) {
    out.locations = locRows.map((r) => ({
      country: r.dimensionValues?.[0]?.value ?? "",
      city: r.dimensionValues?.[1]?.value ?? "",
      region: r.dimensionValues?.[2]?.value ?? "",
      visitors: num(r.metricValues?.[0]?.value),
    }));
  }

  const evRows = reports[5]?.rows ?? [];
  if (evRows.length) {
    const get = (name: string) => num(evRows.find((r) => r.dimensionValues?.[0]?.value === name)?.metricValues?.[0]?.value);
    out.clicks.channels = {
      phone: get("phone_click"),
      email: get("email_click"),
      whatsapp: get("whatsapp_click"),
      formSubmissions: get("generate_lead") + get("contact_form_submit"),
    };
    out.clicks.items = evRows
      .filter((r) => /click|cta|view_item|lead|submit/i.test(r.dimensionValues?.[0]?.value ?? ""))
      .slice(0, 8)
      .map((r) => ({ label: r.dimensionValues?.[0]?.value ?? "", type: "Event", count: num(r.metricValues?.[0]?.value) }));
    out.clicks.totalClicks = out.clicks.items.reduce((a, i) => a + i.count, 0);
  }

  return out;
}

const GA4_CONFIGURED = () =>
  !!process.env.GA4_PROPERTY_ID && !!process.env.GA4_CLIENT_EMAIL && !!process.env.GA4_PRIVATE_KEY;

// ── First-party real-time analytics (our own MongoDB events) ────────────────
const COUNTRY_NAMES: Record<string, string> = {
  CY: "Cyprus", GR: "Greece", GB: "United Kingdom", US: "United States",
  DE: "Germany", FR: "France", IT: "Italy", ES: "Spain", NL: "Netherlands",
  RU: "Russia", UA: "Ukraine", RO: "Romania", BG: "Bulgaria", PL: "Poland",
  IN: "India", AE: "UAE", IL: "Israel", TR: "Turkey", AU: "Australia", CA: "Canada",
};
const SOURCE_ORDER = ["Organic Search", "Direct", "Social Media", "Referral", "Paid Advertising"];

function clickType(name: string): string {
  if (name === "cta_click") return "CTA";
  if (name === "product_click") return "Product";
  if (name === "phone_click" || name === "email_click" || name === "whatsapp_click") return "Button";
  if (name === "outbound_click") return "Link";
  if (name === "generate_lead" || name === "contact_form_submit") return "Form";
  return "Event";
}

interface RawEvent {
  ts: Date; vid: string; sid: string; kind: string; name: string;
  path: string; source: string; device: string; country: string; city: string; region: string; label: string; isNew: boolean;
}

async function getRealtimeAnalytics(range: RangeKey): Promise<AnalyticsData | null> {
  if (!process.env.MONGODB_URI) return null;
  const { connectDB } = await import("@/lib/db");
  const conn = await connectDB();
  if (!conn) return null;
  const { AnalyticsEventModel } = await import("@/lib/models");

  const days = RANGE_DAYS[range];
  const now = Date.now();
  const startMs = now - days * 86_400_000;
  const start = new Date(startMs);

  const docs = (await AnalyticsEventModel.find({ ts: { $gte: start } })
    .sort({ ts: 1 }).limit(200_000).lean()) as unknown as RawEvent[];
  if (!docs.length) return null; // no data yet → caller shows the zero baseline

  const ms = (d: Date) => +new Date(d);

  // Build per-session rollups (first doc per sid is earliest since sorted asc).
  interface Sess { vid: string; views: { path: string; t: number }[]; first: number; last: number; source: string; device: string; country: string; city: string; region: string; }
  const sessions = new Map<string, Sess>();
  const allVids = new Set<string>();
  const newVids = new Set<string>();
  const convSids = new Set<string>();
  const events = docs.filter((d) => d.kind === "event");
  let pageViews = 0;

  for (const d of docs) {
    allVids.add(d.vid);
    if (d.isNew) newVids.add(d.vid);
    let s = sessions.get(d.sid);
    if (!s) {
      s = { vid: d.vid, views: [], first: ms(d.ts), last: ms(d.ts), source: d.source || "Direct", device: d.device || "Desktop", country: d.country, city: d.city, region: d.region };
      sessions.set(d.sid, s);
    }
    const t = ms(d.ts);
    s.first = Math.min(s.first, t); s.last = Math.max(s.last, t);
    if (d.kind === "pageview") { s.views.push({ path: d.path || "/", t }); pageViews++; }
    if (["phone_click", "whatsapp_click", "email_click", "generate_lead", "contact_form_submit"].includes(d.name)) convSids.add(d.sid);
  }

  const sess = [...sessions.values()];
  const totalVisitors = sess.length;                  // visits / sessions
  const uniqueVisitors = allVids.size;                // distinct people
  const returningVisitors = Math.max(0, uniqueVisitors - newVids.size);
  const durations = sess.map((s) => (s.last - s.first) / 1000);
  const avgSessionDuration = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
  const bounced = sess.filter((s) => s.views.length <= 1).length;
  const bounceRate = sess.length ? Math.round((bounced / sess.length) * 1000) / 10 : 0;

  const distinctVids = async (sinceMs: number) =>
    (await AnalyticsEventModel.distinct("vid", { ts: { $gte: new Date(now - sinceMs) } })).length;
  const [visitorsToday, visitorsThisWeek, visitorsThisMonth] = await Promise.all([
    distinctVids(86_400_000), distinctVids(7 * 86_400_000), distinctVids(30 * 86_400_000),
  ]);

  // Trend buckets (distinct visitors per bucket).
  const bucketCount = range === "today" ? 24 : Math.min(days, 30);
  const bucketMs = (now - startMs) / bucketCount;
  const bucketSets = Array.from({ length: bucketCount }, () => new Set<string>());
  for (const d of docs) {
    const i = Math.min(bucketCount - 1, Math.max(0, Math.floor((ms(d.ts) - startMs) / bucketMs)));
    bucketSets[i].add(d.vid);
  }
  const trend = bucketSets.map((set, i) => {
    const bAt = new Date(startMs + i * bucketMs);
    const date = range === "today" ? `${String(bAt.getUTCHours()).padStart(2, "0")}:00` : bAt.toISOString().slice(5, 10);
    return { date, visitors: set.size };
  });

  // Traffic sources (by session).
  const srcCount: Record<string, number> = {};
  for (const s of sess) srcCount[s.source] = (srcCount[s.source] || 0) + 1;
  const srcTotal = sess.length || 1;
  const trafficSources = SOURCE_ORDER.map((label) => ({ label, sessions: srcCount[label] || 0, pct: pct(srcCount[label] || 0, srcTotal) }))
    .filter((s) => s.sessions > 0 || SOURCE_ORDER.indexOf(s.label) < 3);

  // Top pages (+ approx avg time on page from dwell between consecutive views).
  const pageViewsCount: Record<string, number> = {};
  const pageDwell: Record<string, number> = {};
  for (const s of sess) {
    for (let i = 0; i < s.views.length; i++) {
      const v = s.views[i];
      pageViewsCount[v.path] = (pageViewsCount[v.path] || 0) + 1;
      if (i < s.views.length - 1) pageDwell[v.path] = (pageDwell[v.path] || 0) + (s.views[i + 1].t - v.t) / 1000;
    }
  }
  const topPages = Object.entries(pageViewsCount)
    .map(([path, views]) => ({ path, views, avgTime: Math.round((pageDwell[path] || 0) / views) }))
    .sort((a, b) => b.views - a.views).slice(0, 8);

  // Locations (by session).
  const locMap = new Map<string, { country: string; city: string; region: string; visitors: number }>();
  for (const s of sess) {
    if (!s.country && !s.city) continue;
    const key = `${s.country}|${s.city}|${s.region}`;
    const e = locMap.get(key) || { country: COUNTRY_NAMES[s.country] || s.country || "Unknown", city: s.city || "—", region: s.region || "", visitors: 0 };
    e.visitors++; locMap.set(key, e);
  }
  const locations = [...locMap.values()].sort((a, b) => b.visitors - a.visitors).slice(0, 8);

  // Devices (by session).
  const devCount: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
  for (const s of sess) devCount[s.device] = (devCount[s.device] || 0) + 1;
  const devTotal = sess.length || 1;
  const devices = ["Desktop", "Mobile", "Tablet"].map((device) => ({ device, sessions: devCount[device] || 0, pct: pct(devCount[device] || 0, devTotal) }));

  // Clicks.
  const channels = {
    phone: events.filter((e) => e.name === "phone_click").length,
    email: events.filter((e) => e.name === "email_click").length,
    whatsapp: events.filter((e) => e.name === "whatsapp_click").length,
    formSubmissions: events.filter((e) => e.name === "generate_lead" || e.name === "contact_form_submit").length,
  };
  const itemMap = new Map<string, { label: string; type: string; count: number }>();
  for (const e of events) {
    const label = e.label || e.name || "click";
    const key = `${e.name}|${label}`;
    const it = itemMap.get(key) || { label, type: clickType(e.name), count: 0 };
    it.count++; itemMap.set(key, it);
  }
  const clickItems = [...itemMap.values()].sort((a, b) => b.count - a.count).slice(0, 8);

  // Behavior.
  const entryMap: Record<string, number> = {};
  const exitMap: Record<string, number> = {};
  for (const s of sess) {
    if (!s.views.length) continue;
    const entry = s.views[0].path; const exit = s.views[s.views.length - 1].path;
    entryMap[entry] = (entryMap[entry] || 0) + 1;
    exitMap[exit] = (exitMap[exit] || 0) + 1;
  }
  const toRows = (m: Record<string, number>) => Object.entries(m).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count).slice(0, 6);

  const hasView = (s: Sess, test: (p: string) => boolean) => s.views.some((v) => test(v.path));
  const funnel = [
    { step: "Landing", visitors: sess.filter((s) => s.views.length > 0).length },
    { step: "Viewed Products", visitors: sess.filter((s) => hasView(s, (p) => p === "/products" || p.startsWith("/products"))).length },
    { step: "Viewed a Product", visitors: sess.filter((s) => hasView(s, (p) => /^\/products\/.+/.test(p))).length },
    { step: "Reached Contact", visitors: sess.filter((s) => hasView(s, (p) => p.startsWith("/contact"))).length },
    { step: "Enquiry (call/WA/form)", visitors: [...convSids].length },
  ];

  return {
    source: "live",
    range,
    generatedAt: new Date().toISOString(),
    overview: {
      totalVisitors, uniqueVisitors, returningVisitors,
      visitorsToday, visitorsThisWeek, visitorsThisMonth,
      pageViews, avgSessionDuration, bounceRate,
    },
    trend,
    trafficSources,
    topPages,
    locations,
    devices,
    clicks: { totalClicks: events.length, items: clickItems, channels },
    behavior: { entryPages: toRows(entryMap), exitPages: toRows(exitMap), bounceRate, funnel },
  };
}

export async function getAnalytics(range: RangeKey): Promise<AnalyticsData> {
  // 1) First-party real-time data (our own tracking) — primary, no Google deps.
  try {
    const rt = await getRealtimeAnalytics(range);
    if (rt) return rt;
  } catch { /* fall through */ }
  // 2) GA4 Data API, if configured (secondary).
  if (GA4_CONFIGURED()) {
    try { return await fetchFromGA4(range); } catch { /* fall through */ }
  }
  // 3) Clean zero baseline until data arrives.
  return sampleData(range);
}
