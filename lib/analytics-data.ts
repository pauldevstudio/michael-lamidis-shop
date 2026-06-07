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
  source: "ga4" | "sample";
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

export async function getAnalytics(range: RangeKey): Promise<AnalyticsData> {
  if (GA4_CONFIGURED()) {
    try {
      return await fetchFromGA4(range);
    } catch (err) {
      const fallback = sampleData(range);
      fallback.note = `GA4 fetch failed (${String(err)}). Showing sample data.`;
      return fallback;
    }
  }
  return sampleData(range);
}
