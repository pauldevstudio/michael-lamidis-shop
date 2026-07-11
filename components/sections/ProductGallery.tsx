"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid, Square, Loader, Droplets, Wind, Monitor, CookingPot, Coffee,
  Star, Shield, ArrowRight, Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";
import SectionHeader from "@/components/shared/SectionHeader";
import StarRating from "@/components/shared/StarRating";
import VideoCardButton from "@/components/shared/VideoCardButton";
import { FEATURED_PRODUCTS, PRODUCT_CATEGORIES, CATEGORY_COLOR_MAP, DEFAULT_CATEGORY_COLOR, type Product } from "@/lib/constants";
import { productSocialProof } from "@/lib/social-proof";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  LayoutGrid, Square, Loader, Droplets, Wind, Monitor, CookingPot, Coffee,
  Refrigerator: Square, WashingMachine: Loader, Star, Shield, Zap,
};

function ProductCard({
  id, brand, model, originalPrice, salePrice, savings, grade,
  warranty, colorFrom, colorTo, icon, imageUrl, videoUrl, sold,
}: (typeof FEATURED_PRODUCTS)[0]) {
  const Icon = ICONS[icon] ?? Square;
  const proof = productSocialProof(id);
  // Hide the strikethrough + discount badge unless there's a real saving.
  // Guards against typo'd data (sale ≥ original) and 0% rows from looking
  // like nonsense to shoppers.
  const hasRealSaving = originalPrice > salePrice && savings > 0;

  return (
    <Link
      href={`/products/${id}`}
      className="block focus-ring rounded-2xl"
    >
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white rounded-2xl border border-navy-100/70 overflow-hidden hover:border-navy-200 hover:shadow-card-lift transition-all duration-400 cursor-pointer"
    >
      {/* Card visual — full product (object-contain, no crop) on a soft backdrop */}
      <div className="relative h-44 overflow-hidden bg-navy-50/40">
        <VideoCardButton videoUrl={videoUrl} title={`${brand} ${model}`} />
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${brand} ${model}`}
            fill
            loading="lazy"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${colorFrom}18 0%, ${colorTo}0A 100%)` }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
            >
              <Icon className="w-9 h-9 text-white" />
            </div>
          </div>
        )}

        {/* Savings badge — only when there's a real saving */}
        {hasRealSaving && (
          <div
            className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white shadow-md"
            style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
          >
            -{savings}%
          </div>
        )}

        {/* Grade badge */}
        <div className="absolute top-3 right-3 badge-blue text-[10px]">
          Grade {grade}
        </div>

        {/* SOLD ribbon */}
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="px-4 py-1.5 rounded-md bg-red-600 text-white text-sm font-black tracking-[0.2em] uppercase shadow-lg -rotate-12">
              Sold
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col gap-3">
        <div>
          <p className="text-navy-400 text-[11px] font-bold uppercase tracking-widest mb-1">{brand}</p>
          <h3 className="text-navy-950 font-semibold text-sm leading-snug" style={{ fontFamily: "var(--font-jakarta)" }}>
            {model}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={proof.rating} size={13} />
          <span className="text-navy-800 text-xs font-bold tnum">{proof.rating.toFixed(1)}</span>
          <span className="text-navy-400 text-xs tnum">({proof.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-navy-950 font-display font-black text-xl tnum" style={{ fontFamily: "var(--font-jakarta)" }}>
            €{salePrice.toLocaleString("en-US")}
          </span>
          {hasRealSaving && (
            <span className="text-navy-400 text-sm line-through font-medium tnum">
              €{originalPrice.toLocaleString("en-US")}
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-navy-400">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span>{warranty}mo Warranty</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-gold-500" />
            <span>Ready to ship</span>
          </div>
        </div>

        {/* CTA */}
        <span className="btn-primary text-xs !px-4 !py-2.5 mt-1 w-full justify-center">
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.div>
    </Link>
  );
}

export default function ProductGallery({ products }: { products?: Product[] } = {}) {
  const { t } = useLanguage();
  const __content = useContent();
  // Live products are always passed in from the server (getPublicProducts on
  // the homepage). No static-seed fallback — an empty list simply renders
  // nothing rather than stale ghost products whose IDs 404 when clicked.
  const __products = products ?? [];
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? __products
      : __products.filter((p) => p.category === activeCategory);

  // Prefer CMS categoryStrip items so admin edits drive both the icon strip and these filters.
  const __cmsItems = __content?.categoryStrip?.items;
  const categories = (__cmsItems && __cmsItems.length > 0)
    ? __cmsItems.map((c) => ({
        id: c.id,
        label: c.label,
        ...(CATEGORY_COLOR_MAP[c.id] ?? DEFAULT_CATEGORY_COLOR),
      }))
    : PRODUCT_CATEGORIES.map((c) => ({
        ...c,
        label: (t.gallery.categories as Record<string, string>)[c.id] ?? c.id,
      }));

  return (
    <section className="bg-white section-py">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <SectionHeader
          eyebrow={t.gallery.eyebrow}
          title={t.gallery.title}
          subtitle={t.gallery.subtitle}
          theme="light"
          className="mb-10"
        />

        {/* Category filters — only meaningful for the full catalogue. On the
            homepage we show a small featured set, so the tabs are hidden and
            "View all" (below) links to the filterable /products page. */}
        {__products.length > 12 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map(({ id, label, colorFrom }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-250 focus-ring",
                  activeCategory === id
                    ? "text-white shadow-md"
                    : "bg-navy-50 text-navy-400 hover:bg-navy-100 hover:text-navy-700 border border-navy-100"
                )}
                style={
                  activeCategory === id
                    ? { background: `linear-gradient(135deg, ${colorFrom}, ${colorFrom}CC)` }
                    : {}
                }
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Product grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View all */}
        <div className="mt-10 flex justify-center">
          <Link href="/products" className="btn-ghost-dark text-sm">
            {t.gallery.viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
