"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Shield, Zap, SlidersHorizontal, ChevronDown,
  LayoutGrid, Package, ShoppingCart, Check,
} from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import StarRating from "@/components/shared/StarRating";
import VideoCardButton from "@/components/shared/VideoCardButton";
import { FEATURED_PRODUCTS, PRODUCT_CATEGORIES, type Product } from "@/lib/constants";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/i18n-context";
import { productSocialProof } from "@/lib/social-proof";
import { cn } from "@/lib/utils";

/* ── Filter ids (labels come from translations) ───────── */
const FILTER_IDS = [
  "all",
  "refrigerators",
  "washing-machines",
  "ovens",
  "dishwashers",
  "air-conditioners",
  "cookware",
  "small-appliances",
] as const;

type SortKey = "savings" | "price-asc" | "price-desc";

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
          <span className="text-navy-300 text-xs tnum">({proof.reviews})</span>
          <span className="text-navy-200">·</span>
          <span className="text-emerald-600 text-[11px] font-semibold tnum">{proof.sold}+ sold</span>
        </div>

        {/* Mini specs */}
        {product.specs.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {product.specs.slice(0, 2).map((s) => (
              <span key={s.label} className="text-[11px] text-navy-400 font-medium">
                <span className="text-navy-300">{s.label}:</span> {s.value}
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
            <span className="text-navy-300 text-sm line-through font-medium tnum">
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
export default function ProductsContent({ products }: { products?: Product[] }) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("savings");
  const [sortOpen, setSortOpen] = useState(false);

  // Server-fetched live products (Payload/Mongo). No static-seed fallback:
  // an empty list renders the empty state below rather than stale ghost
  // products whose IDs 404 when clicked.
  const __products = products ?? [];

  const FILTERS = FILTER_IDS.map((id) => ({
    id,
    label: t.pages.products.filters[id as keyof typeof t.pages.products.filters],
  }));

  const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "savings",    label: t.pages.products.sortBestDeals },
    { value: "price-asc",  label: t.pages.products.sortPriceAsc },
    { value: "price-desc", label: t.pages.products.sortPriceDesc },
  ];

  const filtered = useMemo(() => {
    const list =
      activeCategory === "all"
        ? [...__products]
        : __products.filter((p) => p.category === activeCategory);

    switch (sortBy) {
      case "price-asc":  return list.sort((a, b) => a.salePrice - b.salePrice);
      case "price-desc": return list.sort((a, b) => b.salePrice - a.salePrice);
      default:           return list.sort((a, b) => b.savings - a.savings);
    }
  }, [activeCategory, sortBy, __products]);

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? t.pages.products.sortBestDeals;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[46vh] flex items-end bg-navy-950 noise-overlay overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 25% 60%, rgba(58,95,138,0.28) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 80% 30%, rgba(30,72,184,0.15) 0%, transparent 50%)",
          }}
        />

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

      {/* ── Filter & Sort bar ────────────────────────────── */}
      <div className="sticky top-[60px] z-30 bg-white/95 backdrop-blur-xl border-b border-navy-100/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-3">
          <div className="flex items-center gap-3 justify-between">

            {/* Category tabs — scrollable */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1 min-w-0">
              {FILTERS.map(({ id, label }) => {
                const cat = PRODUCT_CATEGORIES.find((c) => c.id === id);
                const isActive = activeCategory === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveCategory(id)}
                    className={cn(
                      "flex-shrink-0 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-250 focus-ring",
                      isActive
                        ? "text-white shadow-md"
                        : "bg-navy-50 text-navy-400 hover:bg-navy-100 hover:text-navy-700 border border-navy-100"
                    )}
                    style={
                      isActive && cat
                        ? { background: `linear-gradient(135deg, ${cat.colorFrom}, ${cat.colorTo})` }
                        : isActive
                        ? { background: "linear-gradient(135deg, #3A5F8A, #5B82A8)" }
                        : {}
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Sort dropdown */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-navy-100 bg-white text-navy-600 text-[13px] font-semibold hover:border-navy-200 hover:bg-navy-50 transition-all focus-ring"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {activeSortLabel}
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", sortOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 bg-white border border-navy-100 rounded-xl shadow-card-lift py-1.5 min-w-[180px] z-50"
                  >
                    {SORT_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => { setSortBy(value as SortKey); setSortOpen(false); }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors",
                          sortBy === value
                            ? "text-gold-500 bg-gold-50"
                            : "text-navy-600 hover:bg-navy-50"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ── Product grid ─────────────────────────────────── */}
      <section className="bg-white section-py">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

          {/* Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-navy-400 text-sm font-medium">
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
            <div className="flex items-center gap-1.5 text-xs text-navy-300 font-medium">
              <LayoutGrid className="w-3.5 h-3.5" />
              {t.pages.products.gridView}
            </div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-24 text-navy-300">
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
