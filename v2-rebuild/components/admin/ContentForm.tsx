"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { ArrayField } from "@/components/admin/ArrayField";
import { api } from "@/lib/api";
import type { SiteContent } from "@/types";

interface Props { initial: SiteContent; }

export function ContentForm({ initial }: Props) {
  const router = useRouter();
  const [state, setState] = useState<SiteContent>(initial);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patch<K extends keyof SiteContent>(key: K, partial: Partial<SiteContent[K]>) {
    setState((s) => ({ ...s, [key]: { ...(s[key] as object), ...partial } as SiteContent[K] }));
  }
  function set<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setDone(false);
    try {
      await api.put("/content", state);
      setDone(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Section title="Business">
        <Field label="Name"><Input value={state.business.name} onChange={(e) => patch("business", { name: e.target.value })} /></Field>
        <Field label="Tagline"><Input value={state.business.tagline} onChange={(e) => patch("business", { tagline: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone"><Input value={state.business.phone} onChange={(e) => patch("business", { phone: e.target.value })} /></Field>
          <Field label="Email"><Input type="email" value={state.business.email} onChange={(e) => patch("business", { email: e.target.value })} /></Field>
        </div>
        <Field label="Address"><Input value={state.business.address} onChange={(e) => patch("business", { address: e.target.value })} /></Field>
        <Field label="Hours"><Input value={state.business.hours} onChange={(e) => patch("business", { hours: e.target.value })} /></Field>
        <Field label="Description"><Textarea value={state.business.description} onChange={(e) => patch("business", { description: e.target.value })} /></Field>
      </Section>

      <Section title="Hero">
        <Field label="Badge"><Input value={state.hero.badge} onChange={(e) => patch("hero", { badge: e.target.value })} /></Field>
        <Field label="Headline"><Input value={state.hero.headline} onChange={(e) => patch("hero", { headline: e.target.value })} /></Field>
        <Field label="Subheadline"><Textarea value={state.hero.subheadline} onChange={(e) => patch("hero", { subheadline: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Primary CTA"><Input value={state.hero.ctaPrimary} onChange={(e) => patch("hero", { ctaPrimary: e.target.value })} /></Field>
          <Field label="Secondary CTA"><Input value={state.hero.ctaSecondary} onChange={(e) => patch("hero", { ctaSecondary: e.target.value })} /></Field>
        </div>
      </Section>

      <Section title="Stats">
        <ArrayField
          label="Stat tiles"
          items={state.stats}
          empty={{ label: "", value: "" }}
          fields={[
            { key: "value", label: "Value", placeholder: "e.g. 5,000+" },
            { key: "label", label: "Label", placeholder: "e.g. Happy customers" },
          ]}
          onChange={(v) => set("stats", v)}
        />
      </Section>

      <Section title="Brands carried">
        <ArrayField
          label="Brand list"
          items={state.brands}
          empty={{ name: "" }}
          fields={[{ key: "name", label: "Brand name" }]}
          onChange={(v) => set("brands", v)}
        />
      </Section>

      <Section title="Features">
        <ArrayField
          label="Why-us cards"
          items={state.features}
          empty={{ icon: "shield-check", title: "", body: "" }}
          fields={[
            { key: "icon", label: "Icon (shield-check, badge-check, truck, headphones, sparkles, award)" },
            { key: "title", label: "Title" },
            { key: "body", label: "Body", type: "textarea" },
          ]}
          onChange={(v) => set("features", v)}
        />
      </Section>

      <Section title="Categories">
        <ArrayField
          label="Category tiles"
          items={state.categories}
          empty={{ name: "", image: "", tagline: "", href: "" }}
          fields={[
            { key: "name", label: "Name" },
            { key: "tagline", label: "Tagline" },
            { key: "image", label: "Image URL" },
            { key: "href", label: "Link (optional, defaults to filter)" },
          ]}
          onChange={(v) => set("categories", v)}
        />
      </Section>

      <Section title="Process steps">
        <ArrayField
          label="Steps"
          items={state.process}
          empty={{ title: "", body: "" }}
          fields={[
            { key: "title", label: "Title" },
            { key: "body", label: "Body", type: "textarea" },
          ]}
          onChange={(v) => set("process", v)}
        />
      </Section>

      <Section title="Testimonials">
        <ArrayField
          label="Quotes"
          items={state.testimonials}
          empty={{ quote: "", name: "", city: "", role: "" }}
          fields={[
            { key: "quote", label: "Quote", type: "textarea" },
            { key: "name", label: "Name" },
            { key: "city", label: "City" },
            { key: "role", label: "Role (optional)" },
          ]}
          onChange={(v) => set("testimonials", v)}
        />
      </Section>

      <Section title="Pricing tiers">
        <PricingEditor
          tiers={state.pricing}
          onChange={(v) => set("pricing", v)}
        />
      </Section>

      <Section title="About">
        <Field label="Headline"><Input value={state.about.headline} onChange={(e) => patch("about", { headline: e.target.value })} /></Field>
        <Field label="Body"><Textarea rows={5} value={state.about.body} onChange={(e) => patch("about", { body: e.target.value })} /></Field>
      </Section>

      <Section title="FAQs">
        <ArrayField
          label="Questions & answers"
          items={state.faqs}
          empty={{ question: "", answer: "" }}
          fields={[
            { key: "question", label: "Question" },
            { key: "answer", label: "Answer", type: "textarea" },
          ]}
          onChange={(v) => set("faqs", v)}
        />
      </Section>

      <Section title="Final CTA banner">
        <Field label="Headline"><Input value={state.cta.headline} onChange={(e) => patch("cta", { headline: e.target.value })} /></Field>
        <Field label="Subheadline"><Textarea value={state.cta.subheadline} onChange={(e) => patch("cta", { subheadline: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Primary CTA"><Input value={state.cta.ctaPrimary} onChange={(e) => patch("cta", { ctaPrimary: e.target.value })} /></Field>
          <Field label="Secondary CTA"><Input value={state.cta.ctaSecondary} onChange={(e) => patch("cta", { ctaSecondary: e.target.value })} /></Field>
        </div>
      </Section>

      <div className="sticky bottom-4 z-10 flex items-center gap-3 rounded-xl border border-ink-100 bg-white px-5 py-3 shadow-elevated">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
        {done && <span className="text-sm text-emerald-600">Saved ✓</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
      <h2 className="font-heading text-lg font-semibold text-ink-900">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink-600">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function PricingEditor({
  tiers,
  onChange,
}: {
  tiers: SiteContent["pricing"];
  onChange: (next: SiteContent["pricing"]) => void;
}) {
  function update(idx: number, patch: Partial<SiteContent["pricing"][number]>) {
    onChange(tiers.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  }
  function remove(idx: number) { onChange(tiers.filter((_, i) => i !== idx)); }
  function add() {
    onChange([...tiers, { name: "", tagline: "", savings: "", highlights: [], featured: false }]);
  }
  return (
    <div className="space-y-3">
      {tiers.map((t, idx) => (
        <div key={idx} className="rounded-lg border border-ink-100 bg-bone-100/40 p-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Name"><Input value={t.name} onChange={(e) => update(idx, { name: e.target.value })} /></Field>
            <Field label="Savings"><Input value={t.savings} onChange={(e) => update(idx, { savings: e.target.value })} /></Field>
          </div>
          <Field label="Tagline"><Input value={t.tagline} onChange={(e) => update(idx, { tagline: e.target.value })} /></Field>
          <Field label="Highlights (one per line)">
            <Textarea
              rows={4}
              value={t.highlights.join("\n")}
              onChange={(e) =>
                update(idx, { highlights: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })
              }
            />
          </Field>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!t.featured} onChange={(e) => update(idx, { featured: e.target.checked })} />
              Featured tier
            </label>
            <Button type="button" size="sm" variant="ghost" onClick={() => remove(idx)}>Remove</Button>
          </div>
        </div>
      ))}
      <Button type="button" size="sm" variant="secondary" onClick={add}>+ Add tier</Button>
    </div>
  );
}
