"use client";

import { useEffect, useState } from "react";
import {
  Users, UserPlus, Repeat, Eye, Clock, MousePointerClick, TrendingDown,
  Phone, Mail, MessageCircle, Send, RefreshCw, Globe, Smartphone, Monitor,
  Tablet, MapPin, ArrowDownToLine, ArrowUpFromLine, Info,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import type { AnalyticsData, RangeKey } from "@/lib/analytics-data";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
];

const SOURCE_COLORS: Record<string, string> = {
  "Organic Search": "#059669",
  Direct: "#3A5F8A",
  "Social Media": "#7C3AED",
  Referral: "#D97706",
  "Paid Advertising": "#DB2777",
};
const DEVICE_ICON: Record<string, typeof Monitor> = { Desktop: Monitor, Mobile: Smartphone, Tablet: Tablet };

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
function dur(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m ? `${m}m ${s}s` : `${s}s`;
}

export default function AnalyticsClient() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/admin/analytics?range=${range}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (alive) { setData(d); setLoading(false); } })
      .catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [range]);

  const maxTrend = data ? Math.max(...data.trend.map((t) => t.visitors), 1) : 1;
  const maxFunnel = data?.behavior.funnel[0]?.visitors || 1;

  return (
    <>
      <AdminHeader
        title="Analytics"
        subtitle="Visitor, traffic, click & behavior insights"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl bg-slate-800 p-0.5 border border-slate-700">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRange(r.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    range === r.key ? "bg-gold-500 text-navy-950" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setRange((r) => r)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-950 text-white text-sm font-medium hover:bg-navy-900 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        }
      />

      <main className="flex-1 p-6 space-y-6 overflow-auto">
        {data?.source === "sample" && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200">
              <span className="font-bold">Sample data.</span>{" "}
              {data.note || "Connect GA4 to display live numbers."}{" "}
              See <span className="font-mono">ANALYTICS_SETUP.md</span> for the 3 env vars to go live.
            </p>
          </div>
        )}

        {loading && !data ? (
          <div className="text-slate-400 text-sm">Loading analytics…</div>
        ) : data ? (
          <>
            {/* ── VISITOR OVERVIEW ── */}
            <Section title="Visitor Overview">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Kpi icon={Users} color="#3A5F8A" bg="#EFF6FF" label="Total Visitors" value={fmt(data.overview.totalVisitors)} />
                <Kpi icon={UserPlus} color="#059669" bg="#F0FDF4" label="Unique Visitors" value={fmt(data.overview.uniqueVisitors)} />
                <Kpi icon={Repeat} color="#7C3AED" bg="#F5F3FF" label="Returning" value={fmt(data.overview.returningVisitors)} />
                <Kpi icon={Eye} color="#D97706" bg="#FFFBEB" label="Page Views" value={fmt(data.overview.pageViews)} />
                <Kpi icon={Clock} color="#0F766E" bg="#F0FDFA" label="Avg. Session" value={dur(data.overview.avgSessionDuration)} />
                <Kpi icon={TrendingDown} color="#DB2777" bg="#FDF2F8" label="Bounce Rate" value={`${data.overview.bounceRate}%`} />
                <Kpi icon={Users} color="#2563EB" bg="#EFF6FF" label="This Week" value={fmt(data.overview.visitorsThisWeek)} />
                <Kpi icon={Users} color="#9333EA" bg="#FAF5FF" label="This Month" value={fmt(data.overview.visitorsThisMonth)} />
              </div>
            </Section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trend */}
              <Card className="lg:col-span-2">
                <CardTitle>Visitors over time</CardTitle>
                <div className="flex items-end gap-1 h-44 mt-4">
                  {data.trend.map((t, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end group" title={`${t.date}: ${t.visitors}`}>
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-gold-600 to-gold-400 group-hover:from-gold-500 group-hover:to-gold-300 transition-colors"
                        style={{ height: `${(t.visitors / maxTrend) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                  <span>{data.trend[0]?.date}</span>
                  <span>{data.trend[data.trend.length - 1]?.date}</span>
                </div>
              </Card>

              {/* Traffic sources donut */}
              <Card>
                <CardTitle>Traffic Sources</CardTitle>
                <Donut data={data.trafficSources.map((s) => ({ label: s.label, value: s.sessions, color: SOURCE_COLORS[s.label] || "#64748B" }))} />
                <ul className="mt-4 space-y-2">
                  {data.trafficSources.map((s) => (
                    <li key={s.label} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: SOURCE_COLORS[s.label] || "#64748B" }} />
                        {s.label}
                      </span>
                      <span className="text-slate-400">{s.pct}% · {fmt(s.sessions)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top pages */}
              <Card className="lg:col-span-2">
                <CardTitle>Top Pages</CardTitle>
                <table className="w-full mt-3 text-sm">
                  <thead>
                    <tr className="text-slate-500 text-xs uppercase tracking-wider">
                      <th className="text-left font-semibold py-2">Page</th>
                      <th className="text-right font-semibold py-2">Views</th>
                      <th className="text-right font-semibold py-2">Avg. Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {data.topPages.map((p) => (
                      <tr key={p.path} className="hover:bg-slate-800/50">
                        <td className="py-2 text-slate-200 font-mono text-xs">{p.path}</td>
                        <td className="py-2 text-right text-slate-300">{fmt(p.views)}</td>
                        <td className="py-2 text-right text-slate-400">{dur(p.avgTime)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              {/* Devices */}
              <Card>
                <CardTitle>Devices</CardTitle>
                <div className="space-y-4 mt-4">
                  {data.devices.map((d) => {
                    const Icon = DEVICE_ICON[d.device] || Monitor;
                    return (
                      <div key={d.device}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="flex items-center gap-2 text-slate-300"><Icon className="w-4 h-4" />{d.device}</span>
                          <span className="text-slate-400">{d.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-gold-500 rounded-full" style={{ width: `${d.pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* ── CLICK TRACKING ── */}
            <Section title="Click Tracking">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Kpi icon={Phone} color="#059669" bg="#F0FDF4" label="Phone Clicks" value={fmt(data.clicks.channels.phone)} />
                <Kpi icon={MessageCircle} color="#16A34A" bg="#F0FDF4" label="WhatsApp Clicks" value={fmt(data.clicks.channels.whatsapp)} />
                <Kpi icon={Mail} color="#2563EB" bg="#EFF6FF" label="Email Clicks" value={fmt(data.clicks.channels.email)} />
                <Kpi icon={Send} color="#D97706" bg="#FFFBEB" label="Form Submissions" value={fmt(data.clicks.channels.formSubmissions)} />
              </div>
              <Card>
                <CardTitle>Most Clicked Elements ({fmt(data.clicks.totalClicks)} total)</CardTitle>
                <div className="space-y-3 mt-4">
                  {data.clicks.items.map((it) => {
                    const max = Math.max(...data.clicks.items.map((x) => x.count), 1);
                    return (
                      <div key={it.label}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-200 flex items-center gap-2">
                            <MousePointerClick className="w-3.5 h-3.5 text-slate-500" />
                            {it.label}
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] uppercase tracking-wide">{it.type}</span>
                          </span>
                          <span className="text-slate-400">{fmt(it.count)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-navy-600 to-gold-500 rounded-full" style={{ width: `${(it.count / max) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </Section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Locations */}
              <Card>
                <CardTitle><span className="inline-flex items-center gap-2"><Globe className="w-4 h-4" /> Visitor Location</span></CardTitle>
                <table className="w-full mt-3 text-sm">
                  <thead>
                    <tr className="text-slate-500 text-xs uppercase tracking-wider">
                      <th className="text-left font-semibold py-2">Country</th>
                      <th className="text-left font-semibold py-2">City</th>
                      <th className="text-right font-semibold py-2">Visitors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {data.locations.map((l, i) => (
                      <tr key={i} className="hover:bg-slate-800/50">
                        <td className="py-2 text-slate-200 flex items-center gap-2"><MapPin className="w-3 h-3 text-slate-500" />{l.country}</td>
                        <td className="py-2 text-slate-400">{l.city}</td>
                        <td className="py-2 text-right text-slate-300">{fmt(l.visitors)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              {/* Funnel */}
              <Card>
                <CardTitle>Conversion Funnel</CardTitle>
                <div className="space-y-2 mt-4">
                  {data.behavior.funnel.map((f, i) => {
                    const w = (f.visitors / maxFunnel) * 100;
                    const drop = i > 0 ? Math.round((1 - f.visitors / data.behavior.funnel[i - 1].visitors) * 100) : 0;
                    return (
                      <div key={f.step}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-200">{f.step}</span>
                          <span className="text-slate-400">{fmt(f.visitors)}{i > 0 && <span className="text-rose-400 ml-2">−{drop}%</span>}</span>
                        </div>
                        <div className="h-6 rounded-lg bg-slate-800 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-lg flex items-center pl-2 text-[10px] font-bold text-navy-950" style={{ width: `${w}%` }}>
                            {Math.round(w)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Entry / Exit */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardTitle><span className="inline-flex items-center gap-2"><ArrowDownToLine className="w-4 h-4" /> Entry Pages</span></CardTitle>
                <PathList rows={data.behavior.entryPages} />
              </Card>
              <Card>
                <CardTitle><span className="inline-flex items-center gap-2"><ArrowUpFromLine className="w-4 h-4" /> Exit Pages</span></CardTitle>
                <PathList rows={data.behavior.exitPages} />
              </Card>
            </div>

            <p className="text-center text-xs text-slate-600 pt-2">
              {data.source === "ga4" ? "Live data from Google Analytics 4" : "Sample data"} ·
              generated {new Date(data.generatedAt).toLocaleString()}
            </p>
          </>
        ) : (
          <div className="text-slate-400 text-sm">Couldn’t load analytics.</div>
        )}
      </main>
    </>
  );
}

/* ── small presentational helpers ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-slate-200 text-xs font-bold uppercase tracking-widest mb-3">{title}</h2>
      {children}
    </div>
  );
}
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm ${className}`}>{children}</div>;
}
function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-slate-200 text-sm font-bold">{children}</h3>;
}
function Kpi({ icon: Icon, color, bg, label, value }: { icon: typeof Users; color: string; bg: string; label: string; value: string }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-2xl font-display font-black text-slate-100">{value}</p>
      <p className="text-slate-500 text-xs font-medium mt-0.5">{label}</p>
    </div>
  );
}
function PathList({ rows }: { rows: { path: string; count: number }[] }) {
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <div className="space-y-3 mt-4">
      {rows.map((r) => (
        <div key={r.path}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-200 font-mono">{r.path}</span>
            <span className="text-slate-400">{fmt(r.count)}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-slate-500 rounded-full" style={{ width: `${(r.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
function Donut({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  let offset = 0;
  const r = 52, c = 2 * Math.PI * r;
  return (
    <div className="flex justify-center mt-4">
      <svg viewBox="0 0 140 140" className="w-36 h-36 -rotate-90">
        {data.map((d, i) => {
          const frac = d.value / total;
          const len = frac * c;
          const seg = (
            <circle key={i} cx="70" cy="70" r={r} fill="none" stroke={d.color} strokeWidth="16"
              strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />
          );
          offset += len;
          return seg;
        })}
        <text x="70" y="70" className="rotate-90" transform="rotate(90 70 70)" textAnchor="middle" dominantBaseline="central" fill="#e2e8f0" fontSize="15" fontWeight="800">
          {fmt(total)}
        </text>
      </svg>
    </div>
  );
}
