"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import type { SiteContent } from "@/lib/site-content";

type Toast = { type: "success" | "error"; msg: string } | null;

const FONT_OPTIONS = ["Inter","Plus Jakarta Sans","Roboto","Poppins","DM Sans","Nunito","Open Sans","Lato"];
const PRESET_THEMES = [
  { name: "Navy & Matte Blue",  primary: "#3A5F8A", accent: "#1E48B8" },
  { name: "Royal Gold",         primary: "#D97706", accent: "#B45309" },
  { name: "Emerald Pro",        primary: "#059669", accent: "#047857" },
  { name: "Deep Purple",        primary: "#7C3AED", accent: "#5B21B6" },
  { name: "Crimson",            primary: "#DC2626", accent: "#B91C1C" },
  { name: "Slate Dark",         primary: "#475569", accent: "#334155" },
];

export default function ThemeClient() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: "success" | "error", msg: string) => { setToast({ type, msg }); setTimeout(() => setToast(null), 4000); };

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch("/api/admin/content"); if (res.ok) setContent(await res.json()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const setTheme = (key: keyof SiteContent["theme"], val: string) => {
    if (!content) return;
    setContent({ ...content, theme: { ...content.theme, [key]: val } });
  };

  const applyPreset = (primary: string, accent: string) => {
    if (!content) return;
    setContent({ ...content, theme: { ...content.theme, primaryColor: primary, accentColor: accent } });
  };

  const save = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      if (res.ok) showToast("success", "Theme saved & published!");
      else showToast("error", "Save failed. Try again.");
    } catch { showToast("error", "Network error"); } finally { setSaving(false); }
  };

  if (loading) return (
    <>
      <AdminHeader title="Theme" subtitle="Brand colors and typography" />
      <main className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400"><RefreshCw className="w-5 h-5 animate-spin" /><span className="text-sm font-medium">Loading…</span></div>
      </main>
    </>
  );
  if (!content) return null;

  const t = content.theme;
  const b = content.business;

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium border"
          style={{ background: toast.type === "success" ? "#F0FDF4" : "#FEF2F2", borderColor: toast.type === "success" ? "#BBF7D0" : "#FECACA", color: toast.type === "success" ? "#166534" : "#991B1B" }}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
          {toast.msg}
        </div>
      )}
      <AdminHeader title="Theme" subtitle="Customize brand colors and typography"
        actions={
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #3A5F8A, #5B82A8)" }}>
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save & Publish"}
          </button>
        }
      />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-slate-800 font-bold text-base">Theme Presets</h2>
              <p className="text-slate-500 text-sm">One-click apply a color scheme</p>
            </div>
            <div className="p-6 grid grid-cols-3 sm:grid-cols-6 gap-3">
              {PRESET_THEMES.map(({ name, primary, accent }) => {
                const isActive = t.primaryColor === primary && t.accentColor === accent;
                return (
                  <button key={name} onClick={() => applyPreset(primary, accent)} title={name}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${isActive ? "border-slate-800 shadow-md scale-105" : "border-slate-100 hover:border-slate-300"}`}>
                    <div className="w-10 h-10 rounded-xl shadow-sm" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }} />
                    <span className="text-slate-600 text-[10px] font-medium text-center leading-tight">{name}</span>
                  </button>
                );
              })}
            </div>
          </section>
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-slate-800 font-bold text-base">Brand Colors</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              {([{ key: "primaryColor" as const, label: "Primary Color" }, { key: "accentColor" as const, label: "Accent Color" }]).map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">{label}</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={t[key]} onChange={(e) => setTheme(key, e.target.value)} className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer" />
                    <input value={t[key]} onChange={(e) => setTheme(key, e.target.value)} className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold-500/30" />
                  </div>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-slate-500 text-xs font-medium mb-2">Gradient Preview</p>
                <div className="h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor})` }}>
                  Call to Action Button
                </div>
              </div>
            </div>
          </section>
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-slate-800 font-bold text-base">Typography</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-5">
              {([{ key: "fontHeading" as const, label: "Heading Font" }, { key: "fontBody" as const, label: "Body Font" }]).map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">{label}</label>
                  <select value={t[key]} onChange={(e) => setTheme(key, e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 bg-white">
                    {FONT_OPTIONS.map((f) => <option key={f}>{f}</option>)}
                  </select>
                  <p className="text-slate-400 text-xs" style={{ fontFamily: t[key] }}>The quick brown fox — {t[key]}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100"><h2 className="text-slate-800 font-bold text-base">Site Preview</h2></div>
            <div className="p-6">
              <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: "#030813" }}>
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor})` }}>
                      <span className="text-white font-black text-xs">ML</span>
                    </div>
                    <span className="text-white font-bold text-sm">{b.name}</span>
                  </div>
                  <div className="flex gap-4">{["Home","Products","About"].map((l) => <span key={l} className="text-white/50 text-xs">{l}</span>)}</div>
                </div>
                <div className="px-5 py-8 text-center">
                  <div className="inline-block text-white text-xs px-3 py-1.5 rounded-full mb-4"
                    style={{ background: t.primaryColor + "30", border: `1px solid ${t.primaryColor}50` }}>{content.hero.badge}</div>
                  <h2 className="text-white font-black text-xl whitespace-pre-line mb-2" style={{ fontFamily: t.fontHeading }}>{content.hero.headline}</h2>
                  <p className="text-white/50 text-xs mb-5">{content.hero.subheadline}</p>
                  <button className="px-5 py-2 rounded-xl text-white text-xs font-bold"
                    style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor})` }}>Shop Now</button>
                </div>
              </div>
            </div>
          </section>
          <button onClick={save} disabled={saving} className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #3A5F8A, #5B82A8)" }}>
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save & Publish"}
          </button>
        </div>
      </main>
    </>
  );
}
