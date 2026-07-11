"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Shield, Zap, ChevronDown,
  LayoutGrid, Package, ShoppingCart, Check, X, Search,
} from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import StarRating from "@/components/shared/StarRating";
import VideoCardButton from "@/components/shared/VideoCardButton";
import { FEATURED_PRODUCTS, PRODUCT_CATEGORIES, type Product } from "@/lib/constants";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/i18n-context";
import { productSocialProof } from "@/lib/social-proof";
import { cn } from "@/lib/utils";

/* ── Category ids (labels come from translations) ───────── */
const FILTER_IDS = [
  "all",
  "refrigerators",
  "washing-machines",
  "ovens",
  "dishwashers",
  "air-conditioners",
  "cookware",
  "small-appliances",
  "furniture",
  "garden-furniture",
  "office-equipment",
] as const;

/* ── Category button (pill on desktop, full-width row in the mobile dropdown) ── */
function CategoryButton({
  id, label, count, isActive, empty, onSelect, variant,
}: {
  id: string; label: string; count: number; isActive: boolean; empty: boolean;
  onSelect: (id: string) => void; variant: "pill" | "row";
}) {
  return (
    <button
      type="button"
      disabled={empty}
      aria-pressed={isActive}
      onClick={() => onSelect(id)}
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold transition-all duration-200 focus-ring",
        variant === "pill"
          ? "px-3.5 py-2 min-h-[40px] rounded-full text-[13px]"
          : "w-full justify-between gap-2 px-3 py-2.5 rounded-lg text-[13px]",
        empty
          ? "bg-navy-50/60 text-navy-400 border border-navy-100 opacity-60 cursor-not-allowed"
          : isActive
          ? "text-white shadow-md"
          : variant === "pill"
          ? "bg-navy-50 text-navy-500 hover:bg-navy-100 hover:text-navy-800 border border-navy-100"
          : "text-navy-700 hover:bg-navy-50"
      )}
      style={isActive && !empty ? { background: "linear-gradient(135deg, #1E48B8, #163A96)" } : undefined}
    >
      <span className="truncate">{label}</span>
      <span
        className={cn(
          "shrink-0 text-[10px] font-bold leading-none px-1.5 py-0.5 rounded-full tnum",
          isActive && !empty
            ? "bg-white/25 text-white"
            : variant === "pill"
            ? "bg-white text-navy-400 border border-navy-100"
            : "bg-navy-50 text-navy-400"
        )}
      >
        {count}
      </span>
    </button>
  );
}

/* ── Product Card ──────────────────────────────────────── */
function ProductCard({ product }: { product: (typeof FEATURED_PRODUCTS)[0] }) {
  const cat = PRODUCT_CATEGORIES.find((c) => c.id === product.category);
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [added, setAdded] = useState(false);
  const proof = productSocialProof(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.sold) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white rounded-2xl border border-navy-100/70 overflow-hidden hover:border-navy-200 hover:shadow-card-lift transition-all duration-400 flex flex-col"
    >
      {/* Whole-card click target → product detail. Sits beneath the add-to-cart
          buttons (higher z-index) so those stay independently clickable. */}
      <Link
        href={`/products/${product.id}`}
        aria-label={`View ${product.brand} ${product.model}`}
        className="absolute inset-0 z-[1]"
      />

      {/* Image — object-contain shows the FULL product (no cropping) on a soft
          neutral backdrop, with padding for breathing room. */}
      <div className="relative h-52 overflow-hidden bg-navy-50/40">
        <VideoCardButton videoUrl={product.videoUrl} title={`${product.brand} ${product.model}`} />
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={`${product.brand} ${product.model}`}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${product.colorFrom}18, ${product.colorTo}0A)` }}
          />
        )}

        {/* Savings badge — only when there's a real saving */}
        {product.originalPrice > product.salePrice && product.savings > 0 && (
          <div
            className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white shadow-md"
            style={{ background: `linear-gradient(135deg, ${cat?.colorFrom ?? "#3A5F8A"}, ${cat?.colorTo ?? "#7FAEDB"})` }}
          >
            −{product.savings}%
          </div>
        )}

        {/* Grade badge */}
        <div className="absolute top-3 right-3 badge-blue text-[10px] font-bold">
          {t.pages.products.gradeLabel} {product.grade}
        </div>

        {/* SOLD ribbon */}
        {product.sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 pointer-events-none">
            <span className="px-4 py-1.5 rounded-md bg-red-600 text-white text-sm font-black tracking-[0.2em] uppercase shadow-lg -rotate-12">
              Sold
            </span>
          </div>
        )}

        {/* Quick add-to-cart circle button (appears on hover) */}
        {!product.sold && (
        <button
          onClick={handleAddToCart}
          className={cn(
            "absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 z-20",
            added
              ? "bg-emerald-500 scale-110"
              : "bg-white hover:bg-gold-500 hover:text-white text-navy-700"
          )}
          aria-label="Add to cart"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? "check" : "cart"}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              {added
                ? <Check className="w-4 h-4 text-white" />
                : <ShoppingCart className="w-4 h-4" />
              }
            </motion.span>
          </AnimatePresence>
        </button>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-navy-400 text-[10px] font-bold uppercase tracking-widest mb-1">
            {product.brand}
          </p>
          <h3
            className="text-navy-950 font-semibold text-[15px] leading-snug"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {product.model}
          </h3>
          <p className="text-navy-900/50 text-xs leading-relaxed mt-1.5 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Rating + social proof */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <StarRating rating={proof.rating} size={13} />
          <span className="text-navy-800 text-xs font-bold tnum">{proof.rating.toFixed(1)}</span>
          <span className="text-navy-400 text-xs tnum">({proof.reviews})</span>
          <span className="text-navy-200">·</span>
          <span className="text-emerald-600 text-[11px] font-semibold tnum">{proof.sold}+ sold</span>
        </div>

        {/* Mini specs */}
        {product.specs.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {product.specs.slice(0, 2).map((s) => (
              <span key={s.label} className="text-[11px] text-navy-400 font-medium">
                <span className="text-navy-400">{s.label}:</span> {s.value}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span
            className="text-navy-950 font-black text-xl tnum"
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            €{product.salePrice.toLocaleString("en-US")}
          </span>
          {product.originalPrice > product.salePrice && (
            <span className="text-navy-400 text-sm line-through font-medium tnum">
              €{product.originalPrice.toLocaleString("en-US")}
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-navy-400">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span>{product.warranty}{t.pages.products.warrantyMo}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-gold-400" />
            <span>{t.pages.products.inStock}</span>
          </div>
        </div>

        {/* CTA row: View Details + Add to Cart (above the card-overlay link) */}
        <div className="flex gap-2 mt-1 relative z-10">
          <Link
            href={`/products/${product.id}`}
            className="btn-gold text-xs !px-4 !py-2.5 flex-1 justify-center"
          >
            {t.pages.products.viewDetails}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          {!product.sold && (
          <button
            onClick={handleAddToCart}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 shrink-0",
              added
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-navy-200 text-navy-500 hover:border-gold-400 hover:text-gold-500 hover:bg-gold-50"
            )}
            aria-label="Add to cart"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={added ? "check" : "bag"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.18 }}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
              </motion.span>
            </AnimatePresence>
          </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════ */
export default function ProductsContent({ products, bestDealIds }: { products?: Product[]; bestDealIds?: string[] }) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Server-fetched live products (Payload/Mongo). No static-seed fallback:
  // an empty list renders the empty state below rather than stale ghost
  // products whose IDs 404 when clicked.
  const __products = useMemo(() => products ?? [], [products]);
  // Curated "Best Deals" product ids (from the admin Promo Popup builder),
  // in the chosen order. Drives an extra filter pill in the category bar.
  const __bestDealIds = useMemo(() => bestDealIds ?? [], [bestDealIds]);

  // Per-category product counts for the badges.
  const countFor = (id: string) =>
    id === "all" ? __products.length : __products.filter((p) => p.category === id).length;

  const FILTERS = [
    // "Best Deals" leads the row whenever items are curated in the admin.
    ...(__bestDealIds.length > 0
      ? [{ id: "best-deals", label: t.pages.products.filters["best-deals"], count: __bestDealIds.length }]
      : []),
    ...FILTER_IDS.map((id) => ({
      id,
      label: t.pages.products.filters[id as keyof typeof t.pages.products.filters],
      count: countFor(id),
    })),
  ];

  const activeCat = FILTERS.find((f) => f.id === activeCategory) ?? FILTERS[0];

  // Close the category sheet on Escape + lock body scroll while it's open.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenMenu(null); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openMenu]);

  const filtered = useMemo(() => {
    let list: Product[];
    if (activeCategory === "best-deals") {
      const order = new Map(__bestDealIds.map((id, i) => [id, i]));
      list = __products
        .filter((p) => order.has(p.id))
        .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    } else {
      list =
        activeCategory === "all"
          ? [...__products]
          : __products.filter((p) => p.category === activeCategory);
      list.sort((a, b) => b.savings - a.savings);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) =>
        `${p.brand} ${p.model} ${p.description ?? ""}`.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, __products, __bestDealIds, searchQuery]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[46vh] flex items-end overflow-hidden pt-28 pb-16">
        <Image src="/hero-products.webp" alt="" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(110deg, rgba(3,8,19,0.88) 0%, rgba(3,8,19,0.7) 40%, rgba(3,8,19,0.5) 100%)" }} />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/35 bg-gold-500/12 text-gold-300 text-xs font-bold tracking-[0.18em] uppercase mb-6"
          >
            <Package className="w-3 h-3" />
            {t.pages.products.badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-white leading-[1.05] tracking-tighter max-w-3xl"
            style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2.2rem, 5vw, 3.75rem)" }}
          >
            {t.pages.products.titleLine1}{" "}
            <span className="text-gradient-gold">{t.pages.products.titleLine2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="text-white/50 text-lg mt-4 max-w-lg leading-relaxed"
          >
            {t.pages.products.subtitle}
          </motion.p>

          {/* Mini stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-8"
          >
            {[
              { value: "500+", label: t.pages.products.statProductsInStock },
              { value: "50+",  label: t.pages.products.statPremiumBrands },
              { value: "70%",  label: t.pages.products.statMaxSavings },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span
                  className="text-white font-black text-2xl leading-none"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  {value}
                </span>
                <span className="text-white/40 text-xs font-medium mt-0.5">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Category bar (only the product category — sticky on desktop) ── */}
      <div className="lg:sticky lg:top-12 z-30 bg-white/95 backdrop-blur-xl border-b border-navy-100/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-3 space-y-3">

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.pages.products.searchPlaceholder ?? "Search by brand, model, or keyword…"}
              aria-label="Search products"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-navy-200 bg-white text-navy-900 text-sm placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-400/40 focus:border-gold-400 transition-shadow"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-navy-400 hover:text-navy-600 hover:bg-navy-100 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile: category trigger → bottom sheet */}
          <button
            type="button"
            onClick={() => setOpenMenu("cats")}
            aria-haspopup="dialog"
            aria-expanded={openMenu === "cats"}
            className="lg:hidden w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-navy-200 bg-white text-navy-800 text-sm font-semibold focus-ring"
          >
            <span className="flex items-center gap-2 min-w-0">
              <LayoutGrid className="w-4 h-4 text-navy-400 shrink-0" />
              <span className="truncate">{activeCat?.label}</span>
              <span className="shrink-0 text-[10px] font-bold leading-none px-1.5 py-0.5 rounded-full bg-navy-100 text-navy-500 tnum">
                {activeCat?.count}
              </span>
            </span>
            <ChevronDown className={cn("w-4 h-4 text-navy-400 transition-transform shrink-0", openMenu === "cats" && "rotate-180")} />
          </button>

          {/* Desktop: wrapping category pills */}
          <div className="hidden lg:flex flex-wrap gap-2">
            {FILTERS.map(({ id, label, count }) => (
              <CategoryButton
                key={id}
                id={id}
                label={label}
                count={count}
                isActive={activeCategory === id}
                empty={id !== "all" && count === 0}
                onSelect={setActiveCategory}
                variant="pill"
              />
            ))}
          </div>

        </div>
      </div>

      {/* ── Mobile category bottom sheet (always fully visible) ── */}
      <AnimatePresence>
        {openMenu === "cats" && (
          <div className="lg:hidden">
            <motion.div
              className="fixed inset-0 z-[10000] bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpenMenu(null)}
              aria-hidden="true"
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-[10001] bg-white rounded-t-2xl shadow-2xl flex flex-col max-h-[80vh]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Choose a category"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-navy-100">
                <span className="font-bold text-navy-900">Categories</span>
                <button
                  type="button"
                  onClick={() => setOpenMenu(null)}
                  aria-label="Close"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-navy-400 hover:bg-navy-50 focus-ring"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-3 grid grid-cols-2 gap-2">
                {FILTERS.map(({ id, label, count }) => (
                  <CategoryButton
                    key={id}
                    id={id}
                    label={label}
                    count={count}
                    isActive={activeCategory === id}
                    empty={id !== "all" && count === 0}
                    onSelect={(cid) => { setActiveCategory(cid); setOpenMenu(null); }}
                    variant="row"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Product grid ─────────────────────────────────── */}
      <section className="bg-white section-py">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

          {/* Heading + count */}
          <h2 className="sr-only">
            {activeCategory === "all"
              ? "All products"
              : FILTERS.find((f) => f.id === activeCategory)?.label ?? "Products"}
          </h2>
          <div className="flex items-center justify-between mb-8">
            <p className="text-navy-400 text-sm font-medium" role="status" aria-live="polite">
              {t.pages.products.showing}{" "}
              <span className="text-navy-950 font-semibold">{filtered.length}</span>{" "}
              {filtered.length === 1 ? t.pages.products.productSingular : t.pages.products.productPlural}
              {activeCategory !== "all" && (
                <>
                  {" "}{t.pages.products.inCategory}{" "}
                  <span className="text-gold-500 font-semibold capitalize">
                    {FILTERS.find((f) => f.id === activeCategory)?.label}
                  </span>
                </>
              )}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-navy-400 font-medium">
              <LayoutGrid className="w-3.5 h-3.5" />
              {t.pages.products.gridView}
            </div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-24 text-navy-400">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-navy-400 font-medium">{t.pages.products.emptyMessage}</p>
              <button
                onClick={() => setActiveCategory("all")}
                className="btn-gold text-sm mt-6"
              >
                {t.pages.products.viewAll}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA section ──────────────────────────────────── */}
      <section className="section-py bg-navy-950 noise-overlay relative overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(58,95,138,0.2) 0%, transparent 65%)" }}
        />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <AnimatedSection>
            <h2
              className="text-white font-display font-black text-3xl sm:text-4xl mb-4"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              {t.pages.products.ctaTitle}
            </h2>
            <p className="text-white/50 text-base mb-8 max-w-lg mx-auto leading-relaxed">
              {t.pages.products.ctaSubtitle}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact" className="btn-gold text-sm">
                {t.pages.products.ctaEnquiry}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/about" className="btn-ghost-white text-sm">
                {t.pages.products.ctaAbout}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
