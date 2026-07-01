"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Save, RefreshCw, CheckCircle, AlertCircle, Plus, X, Upload, Loader2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import type { SiteContent } from "@/lib/site-content";

type Tab = "hero" | "about" | "stats" | "announcement";
type Toast = { type: "success" | "error"; msg: string } | null;

export default function ContentClient() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [tab, setTab] = useState<Tab>("hero");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Upload a hero background image to the media store and store its URL.
  const uploadHeroImage = async (file: File) => {
    if (!file.type.startsWith("image/")) { showToast("error", "Please choose an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("error", "Image is too large (max 5 MB)"); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload failed" }));
        showToast("error", err.error ?? "Upload failed");
        return;
      }
      const data = (await res.json()) as { url: string };
      setHero("imageUrl", data.url);
      showToast("success", "Image uploaded — Save & Publish to go live");
    } catch { showToast("error", "Network error during upload"); }
    finally { setUploading(false); }
  };
  const setAbout = (key: keyof SiteContent["about"], val: string | string[]) => {
    if (!content) return;
    setContent({ ...content, about: { ...content.about, [key]: val } });
  };
  const setStats = (key: keyof SiteContent["stats"], val: string) => {
    if (!content) return;
    setContent({ ...content, stats: { ...content.stats, [key]: val } });
  };
  const setAnnouncement = (key: keyof SiteContent["announcement"], val: string | boolean) => {
    if (!content) return;
    setContent({ ...content, announcement: { ...content.announcement, [key]: val } });
  };
  const setStoryParagraph = (idx: number, val: string) => {
    if (!content) return;
    const story = [...content.about.story]; story[idx] = val; setAbout("story", story);
  };
  const addStoryParagraph = () => { if (!content) return; setAbout("story", [...content.about.story, ""]); };
  const removeStoryParagraph = (idx: number) => { if (!content) return; setAbout("story", content.about.story.filter((_, i) => i !== idx)); };

  const TABS: { key: Tab; label: string }[] = [
    { key: "hero", label: "Hero Section" }, { key: "about", label: "About Section" }, { key: "stats", label: "Statistics" }, { key: "announcement", label: "Announcement Bar" },
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
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium border"
          style={{ background: toast.type === "success" ? "#F0FDF4" : "#FEF2F2", borderColor: toast.type === "success" ? "#BBF7D0" : "#FECACA", color: toast.type === "success" ? "#166534" : "#991B1B" }}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
          {toast.msg}
        </div>
      )}
      <AdminHeader title="Content" subtitle="Edit hero, about, statistics & the announcement bar"
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
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-100 shadow-sm w-fit">
            {TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? "bg-navy-950 text-white shadow-sm" : "text-slate-500 hover:text-slate-200"}`}>
                {label}
              </button>
            ))}
          </div>

          {tab === "hero" && (
            <section className="bg-slate-900 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-slate-100 font-bold text-base">Hero Section</h2>
                <p className="text-slate-500 text-sm">The first thing visitors see on your homepage</p>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Badge Text</label>
                  <input value={content.hero.badge} onChange={(e) => setHero("badge", e.target.value)}
                    placeholder="Cyprus's #1 Open Box Destination"
                    className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Headline</label>
                  <textarea value={content.hero.headline} onChange={(e) => setHero("headline", e.target.value)} rows={3}
                    placeholder="Premium Appliances.\nOpen Box Prices."
                    className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400 resize-none font-display" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Subheadline</label>
                  <textarea value={content.hero.subheadline} onChange={(e) => setHero("subheadline", e.target.value)} rows={2}
                    placeholder="Every item certified, warranted & delivered across Cyprus."
                    className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400 resize-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Background Image</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault(); setDragOver(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) uploadHeroImage(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-4 cursor-pointer transition-colors ${
                      dragOver ? "border-blue-400 bg-blue-50" : "border-slate-700 hover:border-slate-300 bg-slate-800"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadHeroImage(f); e.currentTarget.value = ""; }}
                    />
                    {content.hero.imageUrl ? (
                      <div className="flex items-center gap-4">
                        <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={content.hero.imageUrl} alt="Hero preview" className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-200 text-sm font-semibold truncate">{content.hero.imageUrl}</p>
                          <p className="text-slate-400 text-xs mt-1">Click to replace · or drop a new image</p>
                        </div>
                        {uploading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setHero("imageUrl", ""); }}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                            aria-label="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                        {uploading ? (
                          <>
                            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                            <p className="text-slate-400 text-sm font-medium">Uploading…</p>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                              <Upload className="w-4 h-4 text-slate-500" />
                            </div>
                            <p className="text-slate-200 text-sm font-semibold">Drop an image or click to browse</p>
                            <p className="text-slate-400 text-xs">PNG, JPG, WebP up to 5 MB · leave empty to use the default hero</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
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
            <section className="bg-slate-900 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-slate-100 font-bold text-base">About Section</h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Headline</label>
                  <input value={content.about.headline} onChange={(e) => setAbout("headline", e.target.value)}
                    className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Subheadline</label>
                  <input value={content.about.subheadline} onChange={(e) => setAbout("subheadline", e.target.value)}
                    className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400" />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Story Paragraphs</label>
                    <button onClick={addStoryParagraph} className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Paragraph
                    </button>
                  </div>
                  {content.about.story.map((para, i) => (
                    <div key={i} className="relative">
                      <textarea value={para} onChange={(e) => setStoryParagraph(i, e.target.value)} rows={3} placeholder={`Paragraph ${i + 1}…`}
                        className="w-full border border-slate-700 rounded-xl px-4 py-3 pr-10 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400 resize-none" />
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
            <section className="bg-slate-900 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-slate-100 font-bold text-base">Statistics</h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-5">
                {(["customers", "brands", "savings", "cities"] as const).map((key) => {
                  const labels: Record<string, string> = { customers: "Customers Served", brands: "Brands", savings: "Savings Range", cities: "Coverage" };
                  return (
                    <div key={key} className="flex flex-col gap-1.5">
                      <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{labels[key]}</label>
                      <input value={content.stats[key]} onChange={(e) => setStats(key, e.target.value)}
                        className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400" />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {tab === "announcement" && (
            <section className="bg-slate-900 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-slate-100 font-bold text-base">Announcement Bar</h2>
                  <p className="text-slate-500 text-sm">The thin promo strip above the navigation, shown on every page</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={content.announcement.enabled}
                  aria-label="Show or hide the announcement bar"
                  onClick={() => setAnnouncement("enabled", !content.announcement.enabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${content.announcement.enabled ? "bg-emerald-500" : "bg-slate-600"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${content.announcement.enabled ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${content.announcement.enabled ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-700/60 text-slate-400"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${content.announcement.enabled ? "bg-emerald-400" : "bg-slate-400"}`} />
                  {content.announcement.enabled ? "Visible on the site" : "Hidden from visitors"}
                </span>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Message</label>
                  <textarea value={content.announcement.message} onChange={(e) => setAnnouncement("message", e.target.value)} rows={2}
                    placeholder="Spring Sale — Up to 70% off premium open box appliances. Limited stock!"
                    className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Button Label</label>
                    <input value={content.announcement.ctaLabel} onChange={(e) => setAnnouncement("ctaLabel", e.target.value)}
                      placeholder="Shop Now"
                      className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Button Link</label>
                    <input value={content.announcement.ctaHref} onChange={(e) => setAnnouncement("ctaHref", e.target.value)}
                      placeholder="/products"
                      className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400" />
                  </div>
                </div>
                <p className="text-slate-500 text-xs -mt-2">Leave the button label empty to show the message with no button. The link can be a path like <code className="text-slate-400">/products</code> or a full URL.</p>

                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Live Preview</label>
                  {content.announcement.enabled ? (
                    <div className="rounded-xl overflow-hidden border border-slate-700">
                      <div className="flex items-center justify-center gap-3 px-4 py-2.5" style={{ background: "linear-gradient(90deg, #1E48B8 0%, #3D62CC 50%, #1E48B8 100%)" }}>
                        <span className="text-white text-xs sm:text-sm font-medium text-center leading-snug">{content.announcement.message || "Your announcement message…"}</span>
                        {content.announcement.ctaLabel && (
                          <span className="shrink-0 ml-1 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] sm:text-xs font-bold border border-white/30 whitespace-nowrap">{content.announcement.ctaLabel} &rarr;</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/50 px-4 py-4 text-center text-slate-500 text-xs">
                      The bar is turned off — visitors won&rsquo;t see it.
                    </div>
                  )}
                </div>
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
