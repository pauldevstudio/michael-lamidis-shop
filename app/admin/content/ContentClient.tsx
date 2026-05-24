"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, RefreshCw, CheckCircle, AlertCircle, Plus, X } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import type { SiteContent } from "@/lib/site-content";

type Tab = "hero" | "about" | "stats";
type Toast = { type: "success" | "error"; msg: string } | null;

export default function ContentClient() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [tab, setTab] = useState<Tab>("hero");

  const showToast = (type: "success" | "error", msg: string) => { setToast({ type, msg }); setTimeout(() => setToast(null), 4000); };

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch("/api/admin/content"); if (res.ok) setContent(await res.json()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const save = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      if (res.ok) showToast("success", "Content saved & published!");
      else showToast("error", "Save failed. Try again.");
    } catch { showToast("error", "Network error"); } finally { setSaving(false); }
  };

  const setHero = (key: keyof SiteContent["hero"], val: string) => {
    if (!content) return;
    setContent({ ...content, hero: { ...content.hero, [key]: val } });
  };
  const setAbout = (key: keyof SiteContent["about"], val: string | string[]) => {
    if (!content) return;
    setContent({ ...content, about: { ...content.about, [key]: val } });
  };
  const setStats = (key: keyof SiteContent["stats"], val: string) => {
    if (!content) return;
    setContent({ ...content, stats: { ...content.stats, [key]: val } });
  };
  const setStoryParagraph = (idx: number, val: string) => {
    if (!content) return;
    const story = [...content.about.story]; story[idx] = val; setAbout("story", story);
  };
  const addStoryParagraph = () => { if (!content) return; setAbout("story", [...content.about.story, ""]); };
  const removeStoryParagraph = (idx: number) => { if (!content) return; setAbout("story", content.about.story.filter((_, i) => i !== idx)); };

  const TABS: { key: Tab; label: string }[] = [
    { key: "hero", label: "Hero Section" }, { key: "about", label: "About Section" }, { key: "stats", label: "Statistics" },
  ];

  if (loading) return (
    <>
      <AdminHeader title="Content" subtitle="Edit page content" />
      <main className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400"><RefreshCw className="w-5 h-5 animate-spin" /><span className="text-sm font-medium">Loading…</span></div>
      </main>
    </>
  );
  if (!content) return null;

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium border"
          style={{ background: toast.type === "success" ? "#F0FDF4" : "#FEF2F2", borderColor: toast.type === "success" ? "#BBF7D0" : "#FECACA", color: toast.type === "success" ? "#166534" : "#991B1B" }}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
          {toast.msg}
        </div>
      )}
      <AdminHeader title="Content" subtitle="Edit hero, about and statistics sections"
        actions={
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #3A5F8A, #5B82A8)", boxShadow: "0 4px 16px rgba(58,95,138,0.3)" }}>
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save & Publish"}
          </button>
        }
      />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-100 shadow-sm w-fit">
            {TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? "bg-navy-950 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {label}
              </button>
            ))}
          </div>

          {tab === "hero" && (
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-slate-800 font-bold text-base">Hero Section</h2>
                <p className="text-slate-500 text-sm">The first thing visitors see on your homepage</p>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Badge Text</label>
                  <input value={content.hero.badge} onChange={(e) => setHero("badge", e.target.value)}
                    placeholder="Cyprus's #1 Open Box Destination"
                    className="border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Headline</label>
                  <textarea value={content.hero.headline} onChange={(e) => setHero("headline", e.target.value)} rows={3}
                    placeholder="Premium Appliances.\nOpen Box Prices."
                    className="border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400 resize-none font-display" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Subheadline</label>
                  <textarea value={content.hero.subheadline} onChange={(e) => setHero("subheadline", e.target.value)} rows={2}
                    placeholder="Every item certified, warranted & delivered across Cyprus."
                    className="border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400 resize-none" />
                </div>
                <div className="rounded-xl bg-navy-950 p-5 text-center">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-white/15 text-white/60 mb-4">★ {content.hero.badge}</span>
                  <h3 className="text-white font-display font-black text-xl leading-tight whitespace-pre-line mb-2">{content.hero.headline || "Your headline here"}</h3>
                  <p className="text-white/50 text-sm">{content.hero.subheadline}</p>
                </div>
              </div>
            </section>
          )}

          {tab === "about" && (
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-slate-800 font-bold text-base">About Section</h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Headline</label>
                  <input value={content.about.headline} onChange={(e) => setAbout("headline", e.target.value)}
                    className="border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Subheadline</label>
                  <input value={content.about.subheadline} onChange={(e) => setAbout("subheadline", e.target.value)}
                    className="border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400" />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Story Paragraphs</label>
                    <button onClick={addStoryParagraph} className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Paragraph
                    </button>
                  </div>
                  {content.about.story.map((para, i) => (
                    <div key={i} className="relative">
                      <textarea value={para} onChange={(e) => setStoryParagraph(i, e.target.value)} rows={3} placeholder={`Paragraph ${i + 1}…`}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400 resize-none" />
                      <button onClick={() => removeStoryParagraph(i)} className="absolute top-2.5 right-2.5 p-1 text-slate-300 hover:text-red-400 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {tab === "stats" && (
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-slate-800 font-bold text-base">Statistics</h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-5">
                {(["customers", "brands", "savings", "cities"] as const).map((key) => {
                  const labels: Record<string, string> = { customers: "Customers Served", brands: "Brands", savings: "Savings Range", cities: "Coverage" };
                  return (
                    <div key={key} className="flex flex-col gap-1.5">
                      <label className="text-slate-600 text-xs font-semibold uppercase tracking-wider">{labels[key]}</label>
                      <input value={content.stats[key]} onChange={(e) => setStats(key, e.target.value)}
                        className="border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400" />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

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
