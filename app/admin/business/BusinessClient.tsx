"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, RefreshCw, Facebook, Instagram, Youtube, Building2, Phone, Mail, MapPin, Clock, Tag, CheckCircle, AlertCircle } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import type { SiteContent, BusinessInfo } from "@/lib/site-content";

type Toast = { type: "success" | "error"; msg: string } | null;

const FIELDS: Array<{
  key: keyof BusinessInfo;
  label: string;
  placeholder: string;
  icon: React.ElementType;
  type?: string;
  multiline?: boolean;
}> = [
  { key: "name",        label: "Business Name",  placeholder: "Michael Lamidis",                     icon: Tag },
  { key: "tagline",     label: "Tagline",         placeholder: "Open Box. Open Savings.",              icon: Tag },
  { key: "description", label: "Description",     placeholder: "Short description of the business...", icon: Building2, multiline: true },
  { key: "phone",       label: "Phone",           placeholder: "+357 25 123 456",                      icon: Phone },
  { key: "email",       label: "Email",           placeholder: "info@example.com",                     icon: Mail, type: "email" },
  { key: "address",     label: "Address",         placeholder: "123 Street, City, Country",            icon: MapPin },
  { key: "hours",       label: "Business Hours",  placeholder: "Mon–Sat: 09:00–20:00",                 icon: Clock },
];

const SOCIAL_FIELDS: Array<{
  key: keyof BusinessInfo["social"];
  label: string;
  icon: React.ElementType;
  placeholder: string;
}> = [
  { key: "facebook",  label: "Facebook URL",  icon: Facebook,  placeholder: "https://facebook.com/..." },
  { key: "instagram", label: "Instagram URL", icon: Instagram, placeholder: "https://instagram.com/..." },
  { key: "youtube",   label: "YouTube URL",   icon: Youtube,   placeholder: "https://youtube.com/..." },
];

export default function BusinessClient() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) setContent(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const update = (key: keyof BusinessInfo, value: string) => {
    if (!content) return;
    setContent({ ...content, business: { ...content.business, [key]: value } });
  };

  const updateSocial = (key: keyof BusinessInfo["social"], value: string) => {
    if (!content) return;
    setContent({
      ...content,
      business: { ...content.business, social: { ...content.business.social, [key]: value } },
    });
  };

  const save = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) showToast("success", "Business info saved & published!");
      else showToast("error", "Failed to save. Please try again.");
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Business Info" subtitle="Manage your business details" />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Loading…</span>
          </div>
        </main>
      </>
    );
  }

  if (!content) return null;

  const b = content.business;

  return (
    <>
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium border"
          style={{
            background: toast.type === "success" ? "#F0FDF4" : "#FEF2F2",
            borderColor: toast.type === "success" ? "#BBF7D0" : "#FECACA",
            color: toast.type === "success" ? "#166534" : "#991B1B",
          }}
        >
          {toast.type === "success" ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
          {toast.msg}
        </div>
      )}

      <AdminHeader
        title="Business Info"
        subtitle="Manage contact details, social links, and brand identity"
        actions={
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #3A5F8A, #5B82A8)", boxShadow: "0 4px 16px rgba(58,95,138,0.3)" }}
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save & Publish"}
          </button>
        }
      />

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <section className="bg-slate-900 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-slate-100 font-bold text-base">Business Details</h2>
              <p className="text-slate-500 text-sm">Core information shown across the website</p>
            </div>
            <div className="p-6 space-y-5">
              {FIELDS.map(({ key, label, placeholder, icon: Icon, type, multiline }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </label>
                  {multiline ? (
                    <textarea
                      value={(b[key] as string) ?? ""}
                      onChange={(e) => update(key, e.target.value)}
                      placeholder={placeholder}
                      rows={3}
                      className="w-full border border-slate-700 bg-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400 transition resize-none"
                    />
                  ) : (
                    <input
                      type={type ?? "text"}
                      value={(b[key] as string) ?? ""}
                      onChange={(e) => update(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full border border-slate-700 bg-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400 transition"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-900 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-slate-100 font-bold text-base">Social Media</h2>
              <p className="text-slate-500 text-sm">Links to your social profiles</p>
            </div>
            <div className="p-6 space-y-5">
              {SOCIAL_FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </label>
                  <input
                    type="url"
                    value={b.social[key] ?? ""}
                    onChange={(e) => updateSocial(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full border border-slate-700 bg-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400 transition"
                  />
                </div>
              ))}
            </div>
          </section>

          <button
            onClick={save}
            disabled={saving}
            className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #3A5F8A, #5B82A8)" }}
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save & Publish"}
          </button>
        </div>
      </main>
    </>
  );
}
