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
  imageUrl: "", description: "", specs: [{ label: "", value: "" }],
};

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
    initialProduct ? { ...initialProduct } : EMPTY_PRODUCT
  );
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateForm = (key: keyof Omit<Product, "id">, value: string | number) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      if ((key === "originalPrice" || key === "salePrice") && next.originalPrice > 0) {
        next.savings = Math.round(((next.originalPrice - next.salePrice) / next.originalPrice) * 100);
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

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      if (url) updateForm("imageUrl", url);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = "/api/admin/products";
      const method = initialProduct ? "PUT" : "POST";
      const body = initialProduct ? { ...formData, id: initialProduct.id } : formData;
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
          <div className="grid grid-cols-3 gap-4">
            {([
              ["originalPrice", "Original Price (€)", true],
              ["salePrice",     "Sale Price (€)",     true],
              ["savings",       "Savings %",          false],
            ] as const).map(([key, label, required]) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  {label}{required && <span className="text-red-400"> *</span>}
                </label>
                <input
                  type="number"
                  value={(formData[key] as number) || ""}
                  onChange={(e) => updateForm(key, Number(e.target.value))}
                  required={required}
                  className="border border-slate-700 bg-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400"
                />
              </div>
            ))}
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
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Product Image</label>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleUpload(file);
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
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                  e.currentTarget.value = "";
                }}
              />
              {formData.imageUrl ? (
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-sm font-semibold truncate">
                      {formData.imageUrl.startsWith("/uploads/")
                        ? formData.imageUrl.replace("/uploads/", "")
                        : formData.imageUrl}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">Click to replace · or drop a new image</p>
                  </div>
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); updateForm("imageUrl", ""); }}
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
                      <p className="text-slate-400 text-xs">PNG, JPG, WebP, GIF up to 5 MB</p>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
          <div className="grid grid-cols-2 gap-4">
            {(["colorFrom", "colorTo"] as const).map((key) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  {key === "colorFrom" ? "Color From" : "Color To"}
                </label>
                <div className="flex items-center gap-2">
                  <input type="color" value={formData[key]} onChange={(e) => updateForm(key, e.target.value)} className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer" />
                  <input
                    value={formData[key]}
                    onChange={(e) => updateForm(key, e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    className="flex-1 border border-slate-700 bg-slate-800 rounded-xl px-3 py-2 text-slate-100 text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>
            ))}
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
          if (!formData.originalPrice || formData.originalPrice <= 0) missing.push("Original Price");
          if (!formData.salePrice || formData.salePrice <= 0) missing.push("Sale Price");
          const canSave = missing.length === 0;
          return (
            <div className="flex items-center justify-between gap-3 px-6 py-5 border-t border-slate-100">
              <p className="text-slate-500 text-xs h-5">
                {!canSave && (
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
