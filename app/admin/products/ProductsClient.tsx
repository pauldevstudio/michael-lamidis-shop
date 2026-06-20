"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, Search, X, RefreshCw, CheckCircle, AlertCircle, Package,
  Eye, Star, Check, ImagePlus, Loader2, Tag, RotateCcw,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import EditProductModal from "./EditProductModal";
import type { Product } from "@/lib/constants";

type Toast = { type: "success" | "error"; msg: string } | null;

const GRADE_OPTIONS = ["A", "B", "C", "D", "E", "F"];
const CATEGORY_OPTIONS = [
  "refrigerators","washing-machines","ovens","dishwashers","air-conditioners","cookware","small-appliances",
];

interface CategoryDef { id: string; label: string }
const DEFAULT_CATEGORIES: CategoryDef[] = [
  { id: "all",              label: "All Products" },
  { id: "refrigerators",    label: "Refrigerators" },
  { id: "washing-machines", label: "Washing Machines" },
  { id: "ovens",            label: "Ovens" },
  { id: "dishwashers",      label: "Dishwashers" },
  { id: "air-conditioners", label: "Air Conditioners" },
  { id: "cookware",         label: "Cookware" },
  { id: "small-appliances", label: "Small Appliances" },
];
const CATEGORY_LABELS_KEY = "ml-admin-category-labels";
export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [featured, setFeatured] = useState<Set<string>>(new Set());
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState<string>("");
  const priceInputRef = useRef<HTMLInputElement>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [categoryLabels, setCategoryLabels] = useState<Record<string, string>>({});
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [labelDraft, setLabelDraft] = useState<string>("");
  const labelInputRef = useRef<HTMLInputElement>(null);

  // Load saved category-label overrides from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CATEGORY_LABELS_KEY);
      if (raw) setCategoryLabels(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (editingCategory) setTimeout(() => labelInputRef.current?.select(), 0);
  }, [editingCategory]);

  const getCategoryLabel = (id: string): string =>
    categoryLabels[id] ?? DEFAULT_CATEGORIES.find((c) => c.id === id)?.label ?? id;

  const saveCategoryLabel = (id: string, label: string) => {
    const trimmed = label.trim();
    if (!trimmed) { setEditingCategory(null); return; }
    const next = { ...categoryLabels, [id]: trimmed };
    setCategoryLabels(next);
    try { localStorage.setItem(CATEGORY_LABELS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
    setEditingCategory(null);
    showToast("success", "Category renamed");
  };

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) setProducts(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    if (editingPrice) {
      setTimeout(() => priceInputRef.current?.focus(), 0);
    }
  }, [editingPrice]);

  const openCreate = () => { setEditProduct(null); setShowModal(true); };
  const openEdit = (p: Product) => { setEditProduct(p); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditProduct(null); };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) { await fetchProducts(); showToast("success", "Product deleted"); }
      else showToast("error", "Failed to delete");
    } catch {
      showToast("error", "Network error");
    } finally {
      setDeleteId(null);
    }
  };

  const startEditPrice = (p: Product) => {
    setEditingPrice(p.id);
    setPriceDraft(String(p.salePrice));
  };

  const commitPrice = async (p: Product) => {
    const newPrice = Number(priceDraft);
    if (!Number.isFinite(newPrice) || newPrice <= 0) {
      setEditingPrice(null);
      return;
    }
    if (newPrice === p.salePrice) {
      setEditingPrice(null);
      return;
    }
    const savings = p.originalPrice > 0
      ? Math.round(((p.originalPrice - newPrice) / p.originalPrice) * 100)
      : 0;
    const optimistic = products.map((x) =>
      x.id === p.id ? { ...x, salePrice: newPrice, savings } : x
    );
    setProducts(optimistic);
    setEditingPrice(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, salePrice: newPrice, savings }),
      });
      if (res.ok) showToast("success", "Price updated");
      else { await fetchProducts(); showToast("error", "Failed to update price"); }
    } catch {
      await fetchProducts();
      showToast("error", "Network error");
    }
  };

  // ─── Image upload ───────────────────────────────────────────
  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith("image/")) {
      showToast("error", "Please choose an image file");
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Image is too large (max 5 MB)");
      return null;
    }
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Upload failed" }));
      showToast("error", err.error ?? "Upload failed");
      return null;
    }
    const data = (await res.json()) as { url: string };
    return data.url;
  };

  /** Quick replace from product card (no modal). */
  const handleCardUpload = async (p: Product, file: File) => {
    setUploadingId(p.id);
    try {
      const url = await uploadFile(file);
      if (!url) return;
      const optimistic = products.map((x) => (x.id === p.id ? { ...x, imageUrl: url } : x));
      setProducts(optimistic);
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, imageUrl: url }),
      });
      if (res.ok) showToast("success", "Image updated");
      else { await fetchProducts(); showToast("error", "Failed to save image"); }
    } finally {
      setUploadingId(null);
    }
  };

  const toggleFeatured = (id: string) => {
    setFeatured((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /** Persisted Sold toggle — flips product.sold and saves to the catalog. */
  const toggleSold = async (p: Product) => {
    const next = !p.sold;
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, sold: next } : x)));
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, sold: next }),
      });
      if (res.ok) showToast("success", next ? "Marked as SOLD" : "Back in stock");
      else { await fetchProducts(); showToast("error", "Failed to update status"); }
    } catch {
      await fetchProducts();
      showToast("error", "Network error");
    }
  };

  const matchesSearch = (p: Product) =>
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.model.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase());

  const filtered = products.filter((p) =>
    (activeCategory === "all" || p.category === activeCategory) && matchesSearch(p)
  );

  const categoryCounts: Record<string, number> = DEFAULT_CATEGORIES.reduce(
    (acc, c) => ({ ...acc, [c.id]: c.id === "all" ? products.length : products.filter((p) => p.category === c.id).length }),
    {} as Record<string, number>
  );

  const gradeColor: Record<string, string> = {
    "A": "#059669", "B": "#2563EB", "C": "#7C3AED", "D": "#D97706", "E": "#EA580C", "F": "#DC2626",
  };

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
          {toast.type === "success"
            ? <CheckCircle className="w-4 h-4 text-emerald-500" />
            : <AlertCircle className="w-4 h-4 text-red-500" />}
          {toast.msg}
        </div>
      )}

      <AdminHeader
        title="Products"
        subtitle={`${products.length} products in catalog`}
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all"
            style={{ background: "linear-gradient(135deg, #3A5F8A, #5B82A8)", boxShadow: "0 4px 16px rgba(58,95,138,0.3)" }}
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        }
      />

      <main className="flex-1 overflow-auto p-6 bg-slate-800">
        {/* Category filter tabs — click to filter, double-click (or pencil) to rename */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2 -mx-1 px-1">
          {DEFAULT_CATEGORIES.map((c) => {
            const active = activeCategory === c.id;
            const count = categoryCounts[c.id] ?? 0;
            const isEditing = editingCategory === c.id;
            return (
              <div key={c.id} className="relative group shrink-0">
                {isEditing ? (
                  <div className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-slate-900 border-2 border-purple-400 shadow-sm">
                    <input
                      ref={labelInputRef}
                      value={labelDraft}
                      onChange={(e) => setLabelDraft(e.target.value)}
                      onBlur={() => saveCategoryLabel(c.id, labelDraft)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveCategoryLabel(c.id, labelDraft);
                        else if (e.key === "Escape") setEditingCategory(null);
                      }}
                      className="w-32 bg-transparent text-purple-700 text-sm font-bold focus:outline-none"
                    />
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => saveCategoryLabel(c.id, labelDraft)}
                      className="p-1 rounded-md bg-purple-500 text-white hover:bg-purple-600"
                      aria-label="Save name"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveCategory(c.id)}
                    onDoubleClick={() => { setEditingCategory(c.id); setLabelDraft(getCategoryLabel(c.id)); }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                      active
                        ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/30"
                        : "bg-slate-900 text-purple-700 border-purple-200 hover:border-purple-400 hover:bg-purple-50"
                    }`}
                    title="Click to filter · double-click to rename"
                  >
                    {getCategoryLabel(c.id)}
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-black tracking-wide ${
                        active ? "bg-slate-900/20 text-white" : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )}
                {!isEditing && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingCategory(c.id); setLabelDraft(getCategoryLabel(c.id)); }}
                    aria-label={`Rename ${c.label}`}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 shadow-sm flex items-center justify-center text-slate-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="relative mb-5 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-400 bg-slate-900"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl border border-slate-100 py-16 text-center">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm text-slate-400">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filtered.map((p) => {
              const isFeatured = featured.has(p.id);
              const isEditingThis = editingPrice === p.id;
              return (
                <div
                  key={p.id}
                  className="group bg-slate-900 rounded-2xl border border-slate-700 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all overflow-hidden flex flex-col"
                >
                  {/* Image area */}
                  <div className={`relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden ${p.sold ? "opacity-60" : ""}`}>
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={`${p.brand} ${p.model}`}
                        fill
                        className="object-contain p-6"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center text-white font-display font-black text-3xl"
                        style={{ background: `linear-gradient(135deg, ${p.colorFrom}, ${p.colorTo})` }}
                      >
                        {p.brand[0]}
                      </div>
                    )}

                    {/* SOLD ribbon overlay */}
                    {p.sold && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                        <span className="px-4 py-1.5 rounded-md bg-red-600 text-white text-sm font-black tracking-[0.2em] uppercase shadow-lg -rotate-12">
                          Sold
                        </span>
                      </div>
                    )}

                    {/* Grade badge — top-left */}
                    <span
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase shadow-sm"
                      style={{
                        background: (gradeColor[p.grade] ?? "#666") + "22",
                        color: gradeColor[p.grade] ?? "#666",
                      }}
                    >
                      Grade {p.grade}
                    </span>

                    {/* Star (featured) — top-right */}
                    <button
                      onClick={() => toggleFeatured(p.id)}
                      aria-label={isFeatured ? "Unfeature product" : "Feature product"}
                      className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-slate-900/90 backdrop-blur shadow-sm flex items-center justify-center hover:bg-slate-900 transition-colors z-10"
                    >
                      <Star
                        className={`w-4 h-4 transition-colors ${isFeatured ? "text-amber-400 fill-amber-400" : "text-slate-300"}`}
                      />
                    </button>

                    {/* Hover overlay: quick image replace */}
                    <label
                      className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      aria-label="Replace image"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleCardUpload(p, f);
                          e.currentTarget.value = "";
                        }}
                      />
                      <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-slate-100 text-xs font-bold shadow-lg">
                        {uploadingId === p.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Uploading…
                          </>
                        ) : (
                          <>
                            <ImagePlus className="w-3.5 h-3.5" />
                            Replace image
                          </>
                        )}
                      </span>
                    </label>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div className="min-h-[44px]">
                      <p className="text-slate-100 font-bold text-sm leading-snug line-clamp-2">
                        {p.brand} {p.model}
                      </p>
                    </div>

                    {/* Price (inline editable) */}
                    <div className="flex items-end justify-between gap-2">
                      <div className="flex flex-col">
                        {isEditingThis ? (
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 font-bold">€</span>
                            <input
                              ref={priceInputRef}
                              type="number"
                              value={priceDraft}
                              onChange={(e) => setPriceDraft(e.target.value)}
                              onBlur={() => commitPrice(p)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") commitPrice(p);
                                else if (e.key === "Escape") setEditingPrice(null);
                              }}
                              className="w-20 border border-blue-300 bg-blue-50 rounded-md px-2 py-0.5 text-slate-100 font-bold text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => commitPrice(p)}
                              className="p-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                              aria-label="Save price"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditPrice(p)}
                            className="text-left group/price"
                            title="Click to edit price"
                          >
                            <p className="text-slate-100 font-black text-lg leading-none group-hover/price:text-blue-600 transition-colors">
                              €{p.salePrice}
                            </p>
                          </button>
                        )}
                        {p.originalPrice > p.salePrice && (
                          <p className="text-slate-400 text-xs line-through mt-0.5">
                            €{p.originalPrice}
                          </p>
                        )}
                      </div>
                      {p.originalPrice > p.salePrice && p.savings > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-black tracking-wide">
                          −{p.savings}%
                        </span>
                      )}
                    </div>

                    {/* Subline */}
                    <p className="text-slate-400 text-[11px] font-medium capitalize">
                      {p.category.replace("-", " ")} · {p.warranty}-mo warranty
                    </p>

                    {/* Sold toggle */}
                    <button
                      onClick={() => toggleSold(p)}
                      className={`w-full inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-bold transition-colors mt-auto ${
                        p.sold
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/25"
                          : "bg-red-500/15 text-red-400 border border-red-500/40 hover:bg-red-500/25"
                      }`}
                    >
                      {p.sold ? <><RotateCcw className="w-3.5 h-3.5" /> Mark Available</> : <><Tag className="w-3.5 h-3.5" /> Mark as Sold</>}
                    </button>

                    {/* Actions */}
                    <div className="flex items-stretch gap-1.5 pt-1">
                      <Link
                        href={`/products/${p.id}`}
                        target="_blank"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border border-slate-700 text-slate-400 text-xs font-bold hover:bg-slate-800 hover:text-slate-100 hover:border-slate-300 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Link>
                      <button
                        onClick={() => openEdit(p)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border border-slate-700 text-slate-400 text-xs font-bold hover:bg-slate-800 hover:text-slate-100 hover:border-slate-300 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        aria-label="Delete product"
                        className="inline-flex items-center justify-center w-9 rounded-lg border border-slate-700 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-slate-100 font-bold text-lg text-center mb-1">Delete Product?</h3>
            <p className="text-slate-500 text-sm text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-medium hover:bg-slate-800">Cancel</button>
              <button onClick={() => deleteProduct(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <EditProductModal
          initialProduct={editProduct}
          onClose={closeModal}
          onSaved={(action) => {
            fetchProducts();
            showToast("success", action === "updated" ? "Product updated!" : "Product created!");
          }}
          onError={(msg) => showToast("error", msg)}
          uploadFile={uploadFile}
        />
      )}

    </>
  );
}
