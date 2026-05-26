"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, RefreshCw, CheckCircle, AlertCircle, Search, Pencil, X, Globe } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import type { SiteContent, SeoPage } from "@/lib/site-content";

type Toast = { type: "success" | "error"; msg: string } | null;

const PAGE_ROUTES = ["/", "/about", "/products", "/contact", "/blog", "/faq", "/services", "/testimonials"];
const PAGE_LABELS: Record<string, string> = {
  "/": "Homepage", "/about": "About", "/products": "Products", "/contact": "Contact",
  "/blog": "Blog", "/faq": "FAQ", "/services": "Services", "/testimonials": "Testimonials",
};

export default function SeoClient() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [editRoute, setEditRoute] = useState<string | null>(null);
  const [editData, setEditData] = useState<SeoPage>({ title: "", description: "" });

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) setContent(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const openEdit = (route: string) => {
    if (!content) return;
    setEditData(content.seo[route] ?? { title: "", description: "" });
    setEditRoute(route);
  };

  const saveEdit = () => {
    if (!content || !editRoute) return;
    setContent({ ...content, seo: { ...content.seo, [editRoute]: editData } });
    setEditRoute(null);
  };

  const saveAll = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content),
      });
      if (res.ok) showToast("success", "SEO settings saved & published!");
      else showToast("error", "Save failed. Try again.");
    } catch { showToast("error", "Network error"); } finally { setSaving(false); }
  };

  const titleLen = editData.title.length;
  const descLen  = editData.description.length;
  const titleOk  = titleLen >= 30 && titleLen <= 60;
  const descOk   = descLen >= 120 && descLen <= 160;

  if (loading) return (
    <>
      <AdminHeader title="SEO" subtitle="Meta titles and descriptions" />
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
      <AdminHeader title="SEO Settings" subtitle="Meta titles and descriptions for every page"
        actions={
          <button onClick={saveAll} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #3A5F8A, #5B82A8)" }}>
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save All"}
          </button>
        }
      />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex gap-3">
            <Search className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-800 text-sm font-medium">SEO Best Practices</p>
              <p className="text-blue-600 text-xs mt-0.5">Title: 30–60 chars · Description: 120–160 chars.</p>
            </div>
          </div>
          <div className="bg-slate-900 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-slate-500 font-semibold px-5 py-3.5 text-xs uppercase tracking-wider">Page</th>
                    <th className="text-left text-slate-500 font-semibold px-4 py-3.5 text-xs uppercase tracking-wider">Meta Title</th>
                    <th className="text-left text-slate-500 font-semibold px-4 py-3.5 text-xs uppercase tracking-wider hidden lg:table-cell">Description</th>
                    <th className="px-4 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {PAGE_ROUTES.map((route) => {
                    const seo = content.seo[route];
                    const tLen = seo?.title?.length ?? 0;
                    const dLen = seo?.description?.length ?? 0;
                    const tOk = tLen >= 30 && tLen <= 60;
                    const dOk = dLen >= 120 && dLen <= 160;
                    return (
                      <tr key={route} className="hover:bg-slate-800 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                              <Globe className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <div>
                              <p className="text-slate-100 font-semibold">{PAGE_LABELS[route]}</p>
                              <p className="text-slate-400 text-xs font-mono">{route}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 max-w-[200px]">
                          <p className="text-slate-200 text-xs truncate">{seo?.title || <span className="text-slate-300">—</span>}</p>
                          <p className={`text-[10px] mt-0.5 ${tOk ? "text-emerald-500" : "text-amber-500"}`}>{tLen}/{60} chars</p>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell max-w-[240px]">
                          <p className="text-slate-200 text-xs truncate">{seo?.description || <span className="text-slate-300">—</span>}</p>
                          <p className={`text-[10px] mt-0.5 ${dOk ? "text-emerald-500" : "text-amber-500"}`}>{dLen}/{160} chars</p>
                        </td>
                        <td className="px-4 py-4">
                          <button onClick={() => openEdit(route)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-500 text-xs font-medium hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      {editRoute && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-slate-100 font-display font-bold text-lg">Edit SEO — {PAGE_LABELS[editRoute]}</h2>
                <p className="text-slate-400 text-xs font-mono">{editRoute}</p>
              </div>
              <button onClick={() => setEditRoute(null)} className="w-8 h-8 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Meta Title</label>
                  <span className={`text-xs font-medium ${titleOk ? "text-emerald-500" : "text-amber-500"}`}>{titleLen}/60</span>
                </div>
                <input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} maxLength={70}
                  placeholder="Page Title | Michael Lamidis"
                  className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400" />
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${titleOk ? "bg-emerald-400" : titleLen > 60 ? "bg-red-400" : "bg-amber-400"}`}
                    style={{ width: `${Math.min(100, (titleLen / 60) * 100)}%` }} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Meta Description</label>
                  <span className={`text-xs font-medium ${descOk ? "text-emerald-500" : "text-amber-500"}`}>{descLen}/160</span>
                </div>
                <textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} maxLength={200} rows={4}
                  placeholder="A compelling description (120–160 characters)…"
                  className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400 resize-none" />
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${descOk ? "bg-emerald-400" : descLen > 160 ? "bg-red-400" : "bg-amber-400"}`}
                    style={{ width: `${Math.min(100, (descLen / 160) * 100)}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-slate-100">
              <button onClick={() => setEditRoute(null)} className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-medium hover:bg-slate-800">Cancel</button>
              <button onClick={saveEdit} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold"
                style={{ background: "linear-gradient(135deg, #3A5F8A, #5B82A8)" }}>
                <CheckCircle className="w-4 h-4" /> Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
