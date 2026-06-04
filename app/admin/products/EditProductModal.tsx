"use client";

import { useState, useRef } from "react";
import {
  Plus, X, Save, RefreshCw, Upload, Loader2,
} from "lucide-react";
import type { Product } from "@/lib/constants";

const GRADE_OPTIONS = ["A++", "A+", "A", "B"];
const CATEGORY_OPTIONS = [
  "refrigerators", "washing-machines", "ovens", "dishwashers",
  "air-conditioners", "tvs", "small-appliances",
];

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  brand: "", model: "", category: "refrigerators", originalPrice: 0, salePrice: 0, savings: 0,
  grade: "A", warranty: 12, icon: "Package", colorFrom: "#3A5F8A", colorTo: "#5B82A8",
  imageUrl: "", images: [], description: "", specs: [{ label: "", value: "" }],
};

/** Normalise a product into a gallery array (images[0] is the primary/cover). */
function initialGallery(p: Product | null): string[] {
  if (!p) return [];
  if (p.images && p.images.length > 0) return p.images.filter(Boolean);
  return p.imageUrl ? [p.imageUrl] : [];
}

interface Props {
  initialProduct: Product | null;
  onClose: () => void;
  onSaved: (action: "created" | "updated") => void;
  onError: (msg: string) => void;
  uploadFile: (file: File) => Promise<string | null>;
}

/**
 * Edit / create product modal. Owns its own form state so typing here does
 * not trigger re-renders of the parent products grid. Without this isolation
 * fast typing in the brand/model fields could drop or reorder characters.
 */
export default function EditProductModal({
  initialProduct, onClose, onSaved, onError, uploadFile,
}: Props) {
  const [formData, setFormData] = useState<Omit<Product, "id">>(
    initialProduct
      ? { ...initialProduct, images: initialGallery(initialProduct) }
      : EMPTY_PRODUCT
  );
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateForm = (key: keyof Omit<Product, "id">, value: string | number) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      // Single-price model: keep originalPrice mirrored to salePrice and
      // savings at 0 so the public site's "real saving" guard hides the
      // discount badge + strikethrough. Schema stays intact for back-compat.
      if (key === "salePrice") {
        next.originalPrice = next.salePrice;
        next.savings = 0;
      }
      return next;
    });
  };

  const updateSpec = (idx: number, field: "label" | "value", val: string) => {
    setFormData((p) => {
      const specs = [...p.specs];
      specs[idx] = { ...specs[idx], [field]: val };
      return { ...p, specs };
    });
  };
  const addSpec = () => setFormData((p) => ({ ...p, specs: [...p.specs, { label: "", value: "" }] }));
  const removeSpec = (idx: number) =>
    setFormData((p) => ({ ...p, specs: p.specs.filter((_, i) => i !== idx) }));

  // Append one or more uploaded images to the gallery. images[0] stays the
  // primary/cover and is mirrored to imageUrl for the grid + public pages.
  const handleUpload = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (arr.length === 0) return;
    setUploading(true);
    try {
      for (const file of arr) {
        const url = await uploadFile(file);
        if (!url) continue;
        setFormData((prev) => {
          const images = [...(prev.images ?? []), url];
          return { ...prev, images, imageUrl: images[0] };
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) =>
    setFormData((prev) => {
      const images = (prev.images ?? []).filter((_, i) => i !== idx);
      return { ...prev, images, imageUrl: images[0] ?? "" };
    });

  const makePrimary = (idx: number) =>
    setFormData((prev) => {
      const images = [...(prev.images ?? [])];
      if (idx <= 0 || idx >= images.length) return prev;
      const [pick] = images.splice(idx, 1);
      const next = [pick, ...images];
      return { ...prev, images: next, imageUrl: next[0] ?? "" };
    });

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = "/api/admin/products";
      const method = initialProduct ? "PUT" : "POST";
      // Payload requires both label and value when a spec row exists,
      // so drop any half-empty rows (including the default placeholder one).
      const cleanSpecs = formData.specs.filter(
        (s) => s.label.trim() && s.value.trim()
      );
      // Single-price model: force originalPrice = salePrice and savings = 0
      // on the payload, in case an older record loaded with a different
      // originalPrice and the user never touched the Price input.
      const images = (formData.images ?? []).filter(Boolean);
      const payload = {
        ...formData,
        originalPrice: formData.salePrice,
        savings: 0,
        images,
        imageUrl: images[0] ?? "",
        specs: cleanSpecs,
      };
      const body = initialProduct ? { ...payload, id: initialProduct.id } : payload;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        onSaved(initialProduct ? "updated" : "created");
        onClose();
      } else {
        const data = await res.json().catch(() => ({}));
        const detail = (data as { error?: string }).error;
        onError(detail ? `Save failed: ${detail.slice(0, 120)}` : "Failed to save product");
      }
    } catch {
      onError("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto">
      <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-slate-100 font-display font-bold text-lg">
            {initialProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-400 hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Brand <span className="text-red-400">*</span>
              </label>
              <input
                value={formData.brand}
                onChange={(e) => updateForm("brand", e.target.value)}
                placeholder="Samsung"
                autoComplete="off"
                spellCheck={false}
                required
                className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Model <span className="text-red-400">*</span>
              </label>
              <input
                value={formData.model}
                onChange={(e) => updateForm("model", e.target.value)}
                placeholder="RS68A8820WW"
                autoComplete="off"
                spellCheck={false}
                required
                className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Category</label>
              <select value={formData.category} onChange={(e) => updateForm("category", e.target.value)} className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400">
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c.replace("-", " ")}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Grade</label>
              <select value={formData.grade} onChange={(e) => updateForm("grade", e.target.value)} className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400">
                {GRADE_OPTIONS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Price (€) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={formData.salePrice || ""}
              onChange={(e) => updateForm("salePrice", Number(e.target.value))}
              required
              className="w-48 border border-slate-700 bg-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Warranty (months)</label>
            <input
              type="number"
              value={formData.warranty || ""}
              onChange={(e) => updateForm("warranty", Number(e.target.value))}
              placeholder="12"
              className="w-32 border border-slate-700 bg-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Product Images</label>
              {(formData.images?.length ?? 0) > 0 && (
                <span className="text-slate-500 text-[11px] font-medium">
                  {formData.images!.length} photo{formData.images!.length > 1 ? "s" : ""} · first is the cover
                </span>
              )}
            </div>

            {/* Uploaded gallery — hover a non-cover photo to set it as cover */}
            {(formData.images?.length ?? 0) > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {formData.images!.map((url, i) => (
                  <div
                    key={url + i}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-900"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Product photo ${i + 1}`} className="absolute inset-0 w-full h-full object-contain p-1.5" />
                    {i === 0 ? (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-gold-500 text-[9px] font-black text-white tracking-wider shadow">
                        COVER
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => makePrimary(i)}
                        className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-slate-900/85 text-[9px] font-bold text-slate-200 opacity-0 group-hover:opacity-100 hover:bg-slate-900 transition-opacity"
                      >
                        Set cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      aria-label="Remove image"
                      className="absolute top-1 right-1 w-5 h-5 rounded-md bg-slate-900/85 flex items-center justify-center text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Dropzone — always available so more photos can be added */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files?.length) handleUpload(e.dataTransfer.files);
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
                multiple
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files?.length) handleUpload(e.target.files);
                  e.currentTarget.value = "";
                }}
              />
              <div className="flex flex-col items-center justify-center gap-2 py-5 text-center">
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
                    <p className="text-slate-200 text-sm font-semibold">
                      {(formData.images?.length ?? 0) > 0 ? "Add more photos" : "Drop images or click to browse"}
                    </p>
                    <p className="text-slate-400 text-xs">PNG, JPG, WebP, GIF up to 5 MB · select several at once</p>
                  </>
                )}
              </div>
            </div>

          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateForm("description", e.target.value)}
              rows={3}
              placeholder="Product description…"
              spellCheck={false}
              className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400 resize-none"
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Specifications</label>
              <button onClick={addSpec} className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Row
              </button>
            </div>
            {formData.specs.map((spec, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={spec.label}
                  onChange={(e) => updateSpec(i, "label", e.target.value)}
                  placeholder="Label"
                  autoComplete="off"
                  spellCheck={false}
                  className="flex-1 border border-slate-700 bg-slate-800 rounded-xl px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400"
                />
                <input
                  value={spec.value}
                  onChange={(e) => updateSpec(i, "value", e.target.value)}
                  placeholder="Value"
                  autoComplete="off"
                  spellCheck={false}
                  className="flex-1 border border-slate-700 bg-slate-800 rounded-xl px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400"
                />
                <button onClick={() => removeSpec(i)} className="p-1.5 text-slate-300 hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        {(() => {
          const missing: string[] = [];
          if (!formData.brand) missing.push("Brand");
          if (!formData.model) missing.push("Model");
          if (!formData.salePrice || formData.salePrice <= 0) missing.push("Price");
          const canSave = missing.length === 0;
          return (
            <div className="flex items-center justify-between gap-3 px-6 py-5 border-t border-slate-100">
              <p className="text-slate-500 text-xs h-5">
                {missing.length > 0 && (
                  <>
                    <span className="text-red-400">*</span> Required: {missing.join(", ")}
                  </>
                )}
              </p>
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-medium hover:bg-slate-800">Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={saving || !canSave}
                  title={!canSave ? `Fill ${missing.join(", ")} first` : undefined}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #3A5F8A, #5B82A8)" }}
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving…" : initialProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
