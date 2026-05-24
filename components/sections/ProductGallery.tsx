"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, Square, Loader, Droplets, Wind, Monitor, Coffee,
  Star, Shield, ArrowRight, Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import SectionHeader from "@/components/shared/SectionHeader";
import { FEATURED_PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  LayoutGrid, Square, Loader, Droplets, Wind, Monitor, Coffee,
  Refrigerator: Square, WashingMachine: Loader, Star, Shield, Zap,
};

function ProductCard({
  brand, model, originalPrice, salePrice, savings, grade,
  warranty, colorFrom, colorTo, icon, imageUrl,
}: (typeof FEATURED_PRODUCTS)[0]) {
  const Icon = ICONS[icon] ?? Square;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white rounded-2xl border border-navy-100/70 overflow-hidden hover:border-navy-200 hover:shadow-card-lift transition-all duration-400 cursor-default"
    >
      {/* Card visual — real photo */}
      <div className="relative h-44 overflow-hidden">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={`${brand} ${model}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Dark gradient for badge readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
          </>
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

        {/* Savings badge */}
        <div
          className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white shadow-md"
          style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
        >
          -{savings}%
        </div>

        {/* Grade badge */}
        <div className="absolute top-3 right-3 badge-blue text-[10px]">
          Grade {grade}
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col gap-3">
        <div>
          <p className="text-navy-400 text-[11px] font-bold uppercase tracking-widest mb-1">{brand}</p>
          <h3 className="text-navy-950 font-semibold text-sm leading-snug" style={{ fontFamily: "var(--font-jakarta)" }}>
            {model}
          </h3>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-navy-950 font-display font-black text-xl" style={{ fontFamily: "var(--font-jakarta)" }}>
            €{salePrice.toLocaleString("el-GR")}
          </span>
          <span className="text-navy-300 text-sm line-through font-medium">
            €{originalPrice.toLocaleString("el-GR")}
          </span>
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
        <Link
          href="/contact"
          className="btn-primary text-xs !px-4 !py-2.5 mt-1 w-full justify-center"
        >
          Get This Deal
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function ProductGallery() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? FEATURED_PRODUCTS
      : FEATURED_PRODUCTS.filter((p) => p.category === activeCategory);

  const categories = PRODUCT_CATEGORIES.map((c) => ({
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

        {/* Category filters */}
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

        {/* Product grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </AnimatePresence>
        </motion.div>

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
