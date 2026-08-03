"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Shield, Zap,
  LayoutGrid, Package, ShoppingCart, Check, X, Search,
} from "lucide-react";
import { MEGA_MENU_CATEGORIES, MEGA_MENU_SPECIAL } from "@/lib/mega-menu-categories";
import AnimatedSection from "@/components/shared/AnimatedSection";
import StarRating from "@/components/shared/StarRating";
import VideoCardButton from "@/components/shared/VideoCardButton";
import { FEATURED_PRODUCTS, PRODUCT_CATEGORIES, type Product } from "@/lib/constants";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/i18n-context";
import { productSocialProof } from "@/lib/social-proof";
import { cn } from "@/lib/utils";

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
          <h3 className="text-navy-950 font-bold text-[15px] leading-snug" style={{ fontFamily: "var(--font-jakarta)" }}>
            {product.name || product.model}
          </h3>
          {product.name && (
            <p className="text-[12px] text-navy-500 leading-snug">{product.model}</p>
          )}
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
  const { t, lang } = useLanguage();
  const searchParams = useSearchParams();
  const hasCategory = searchParams.has("category");
  const urlCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(hasCategory ? urlCategory : "landing");

  useEffect(() => {
    setActiveCategory(hasCategory ? urlCategory : "landing");
  }, [hasCategory, urlCategory]);
  const [searchQuery, setSearchQuery] = useState("");
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());
  const handleImgError = useCallback((id: string) => {
    setImgErrors((prev) => new Set(prev).add(id));
  }, []);

  // Server-fetched live products (Payload/Mongo). No static-seed fallback:
  // an empty list renders the empty state below rather than stale ghost
  // products whose IDs 404 when clicked.
  const __products = useMemo(() => products ?? [], [products]);
  // Curated "Best Deals" product ids (from the admin Promo Popup builder),
  // in the chosen order. Drives an extra filter pill in the category bar.
  const __bestDealIds = useMemo(() => bestDealIds ?? [], [bestDealIds]);

  const categoryLabel = (id: string) =>
    t.pages.products.filters[id as keyof typeof t.pages.products.filters] ?? id;

  const effectiveCategory = activeCategory === "landing" && searchQuery.trim() ? "all" : activeCategory;

  const filtered = useMemo(() => {
    let list: Product[];
    if (effectiveCategory === "best-deals") {
      const order = new Map(__bestDealIds.map((id, i) => [id, i]));
      list = __products
        .filter((p) => order.has(p.id))
        .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    } else {
      list =
        effectiveCategory === "all"
          ? [...__products]
          : __products.filter((p) => p.category === effectiveCategory);
      list.sort((a, b) => b.savings - a.savings);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) =>
        `${p.name ?? ""} ${p.brand} ${p.model} ${p.description ?? ""}`.toLowerCase().includes(q)
      );
    }
    return list;
  }, [effectiveCategory, __products, __bestDealIds, searchQuery]);

  const PRODUCTS_PER_PAGE = 24;
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [effectiveCategory, searchQuery]);
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paged = useMemo(
    () => filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE),
    [filtered, page]
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const goToPage = useCallback((p: number) => {
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of __products) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [__products]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[44vh] flex items-end overflow-hidden pt-28 pb-16">
        <Image src="/hero-products.webp" alt="" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(3,8,19,0.76) 0%, rgba(3,8,19,0.46) 42%, rgba(3,8,19,0.14) 100%)" }} />

        <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm text-white/75 text-[11px] font-medium tracking-[0.12em] uppercase mb-7"
          >
            <Package className="w-3 h-3 opacity-70" />
            {t.pages.products.badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-white leading-[1.06] tracking-[-0.025em] max-w-3xl"
            style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
          >
            {t.pages.products.titleLine1}{" "}
            <span className="text-blue-400">{t.pages.products.titleLine2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="text-white/55 text-[0.95rem] sm:text-[1.05rem] leading-[1.7] mt-5 max-w-[480px]"
          >
            {t.pages.products.subtitle}
          </motion.p>

          {/* Mini stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="flex flex-wrap items-center gap-x-10 gap-y-3 mt-9"
          >
            {[
              { value: "500+", label: t.pages.products.statProductsInStock },
              { value: "50+",  label: t.pages.products.statPremiumBrands },
              { value: "70%",  label: t.pages.products.statMaxSavings },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span
                  className="text-white font-black text-xl leading-none tnum"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  {value}
                </span>
                <span className="text-white/40 text-[11px] font-medium mt-1 tracking-wide">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Sticky toolbar (search + breadcrumb) ── */}
      <div className="sticky top-[56px] z-30 bg-white/95 backdrop-blur-xl border-b border-navy-100/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {effectiveCategory !== "landing" && (
            <div className="flex items-center gap-2 pt-2.5 pb-1 text-sm">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 font-medium text-navy-500 hover:text-navy-950 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                {lang === "gr" ? "Κατηγορίες" : "Categories"}
              </Link>
              <span className="text-navy-300">/</span>
              <span className="font-semibold text-navy-950 capitalize">
                {effectiveCategory === "all"
                  ? (lang === "gr" ? "Όλα τα Προϊόντα" : searchQuery.trim() ? "Search Results" : "All Products")
                  : categoryLabel(effectiveCategory)}
              </span>
            </div>
          )}
          <div className="relative py-2.5">
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
        </div>
      </div>

      {/* ── Category cards (only on the main /products landing) ── */}
      {effectiveCategory === "landing" && (
      <section className="bg-navy-50/40 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-navy-950 font-display font-bold text-lg tracking-tight mb-6">
            {lang === "gr" ? "Κατηγορίες Προϊόντων" : "Shop by Category"}
          </h2>

          {/* Special cards: Best Deals + All Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {MEGA_MENU_SPECIAL.map((cat) => {
              const hasImage = !imgErrors.has(cat.id);
              const href = `/products?category=${cat.id}`;
              const count = cat.id === "all" ? __products.length : (cat.id === "best-deals" ? __bestDealIds.length : 0);
              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={cn(
                    "group relative overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                    activeCategory === cat.id && "ring-2 ring-blue-500"
                  )}
                >
                  <div className="relative aspect-[5/2] overflow-hidden">
                    {hasImage ? (
                      <Image
                        src={cat.image}
                        alt={lang === "gr" ? cat.labelGr : cat.label}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 50vw"
                        onError={() => handleImgError(cat.id)}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${cat.colorFrom}, ${cat.colorTo})` }}
                      >
                        <cat.icon className="w-10 h-10 text-white/80" strokeWidth={1.5} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-base leading-tight">
                      {lang === "gr" ? cat.labelGr : cat.label}
                    </h3>
                    <p className="text-white/60 text-xs mt-1">
                      {count > 0 ? `${count} ${count === 1 ? "Product" : "Products"}` : (lang === "gr" ? "Σύντομα" : "Coming Soon")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {MEGA_MENU_CATEGORIES.map((cat) => {
              const hasImage = !imgErrors.has(cat.id);
              const count = categoryCounts[cat.id] ?? 0;
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  className={cn(
                    "group relative overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                    activeCategory === cat.id && "ring-2 ring-blue-500"
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {hasImage ? (
                      <Image
                        src={cat.image}
                        alt={lang === "gr" ? cat.labelGr : cat.label}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        onError={() => handleImgError(cat.id)}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${cat.colorFrom}, ${cat.colorTo})` }}
                      >
                        <cat.icon className="w-12 h-12 text-white/80" strokeWidth={1.5} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-sm leading-tight">
                      {lang === "gr" ? cat.labelGr : cat.label}
                    </h3>
                    <p className="text-white/60 text-xs mt-1">
                      {count > 0 ? `${count} ${count === 1 ? "Product" : "Products"}` : (lang === "gr" ? "Σύντομα" : "Coming Soon")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* ── Product grid (only when a category is selected) ── */}
      {effectiveCategory !== "landing" && (
      <section className="bg-white section-py">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

          {/* Heading + count */}
          <h2 className="sr-only">
            {effectiveCategory === "all"
              ? "All products"
              : categoryLabel(effectiveCategory)}
          </h2>
          <div className="flex items-center justify-between mb-8">
            <p className="text-navy-400 text-sm font-medium" role="status" aria-live="polite">
              {t.pages.products.showing}{" "}
              <span className="text-navy-950 font-semibold">{filtered.length}</span>{" "}
              {filtered.length === 1 ? t.pages.products.productSingular : t.pages.products.productPlural}
              {effectiveCategory !== "all" && (
                <>
                  {" "}{t.pages.products.inCategory}{" "}
                  <span className="text-gold-500 font-semibold capitalize">
                    {categoryLabel(effectiveCategory)}
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
          <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 scroll-mt-32">
            {paged.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Product pages" className="flex items-center justify-center gap-1.5 mt-10">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-navy-200 text-navy-500 hover:border-navy-400 hover:text-navy-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] ?? 0) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-navy-400 text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p as number)}
                      className={cn(
                        "w-9 h-9 rounded-lg text-sm font-medium transition-colors",
                        p === page
                          ? "bg-navy-950 text-white"
                          : "border border-navy-200 text-navy-600 hover:border-navy-400 hover:text-navy-800"
                      )}
                      aria-current={p === page ? "page" : undefined}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-navy-200 text-navy-500 hover:border-navy-400 hover:text-navy-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          )}

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
      )}

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
