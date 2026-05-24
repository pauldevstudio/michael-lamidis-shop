"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { slugify } from "@/lib/utils";
import type { Product, ProductInput } from "@/types";

interface Props { initial?: Product; }

const empty: ProductInput = {
  slug: "", name: "", brand: "", category: "", description: "",
  price: 0, originalPrice: undefined, currency: "EUR",
  condition: "open-box", images: [], specs: [],
  stock: 0, featured: false, active: true,
};

export function ProductForm({ initial }: Props) {
  const router = useRouter();
  const [state, setState] = useState<ProductInput>(initial ?? empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...state, slug: state.slug || slugify(state.name) };
      if (initial) {
        await api.put(`/products/${initial._id}`, payload);
      } else {
        await api.post(`/products`, payload);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2 rounded-xl border border-ink-100 bg-white p-6 shadow-card">
        <Field label="Name">
          <Input value={state.name} onChange={(e) => update("name", e.target.value)} required />
        </Field>
        <Field label="Slug (auto from name if empty)">
          <Input value={state.slug} onChange={(e) => update("slug", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand"><Input value={state.brand} onChange={(e) => update("brand", e.target.value)} required /></Field>
          <Field label="Category"><Input value={state.category} onChange={(e) => update("category", e.target.value)} required /></Field>
        </div>
        <Field label="Description">
          <Textarea rows={6} value={state.description} onChange={(e) => update("description", e.target.value)} required />
        </Field>
        <Field label="Image URLs (one per line)">
          <Textarea
            rows={3}
            value={state.images.map((i) => i.url).join("\n")}
            onChange={(e) =>
              update("images", e.target.value.split("\n").map((url) => url.trim()).filter(Boolean).map((url) => ({ url })))
            }
          />
        </Field>
      </div>

      <div className="space-y-4 rounded-xl border border-ink-100 bg-white p-6 shadow-card h-fit">
        <Field label="Price (EUR)">
          <Input type="number" value={state.price} onChange={(e) => update("price", Number(e.target.value))} required />
        </Field>
        <Field label="Original price (optional)">
          <Input
            type="number"
            value={state.originalPrice ?? ""}
            onChange={(e) => update("originalPrice", e.target.value ? Number(e.target.value) : undefined)}
          />
        </Field>
        <Field label="Stock">
          <Input type="number" value={state.stock} onChange={(e) => update("stock", Number(e.target.value))} />
        </Field>
        <Field label="Condition">
          <select
            value={state.condition}
            onChange={(e) => update("condition", e.target.value as Product["condition"])}
            className="h-11 w-full rounded-md border border-ink-200 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink-900"
          >
            <option value="new">New</option>
            <option value="open-box">Open box</option>
            <option value="refurbished">Refurbished</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" checked={state.featured} onChange={(e) => update("featured", e.target.checked)} />
          Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" checked={state.active} onChange={(e) => update("active", e.target.checked)} />
          Visible on storefront
        </label>

        {error && <p className="text-xs text-red-600">{error}</p>}
        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Saving…" : initial ? "Update product" : "Create product"}
        </Button>
      </div>
    </form>
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
