"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Shield, Truck, RotateCcw, Award,
  CheckCircle2, Phone, Mail, ShoppingCart, Minus, Plus, Star,
  Package, Zap,
} from "lucide-react";
import type { Product } from "@/lib/constants";
import { FEATURED_PRODUCTS, SITE_PHONE } from "@/lib/constants";
import { useCart } from "@/lib/cart-context";
import AnimatedSection, { StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import { cn } from "@/lib/utils";

/* ── Grade color helper ─────────────────────────────── */
function gradeColor(grade: string) {
  if (grade === "A++") return { bg: "#D1FAE5", text: "#059669", border: "#6EE7B7" };
  if (grade === "A+")  return { bg: "#DBEAFE", text: "#1D4ED8", border: "#93C5FD" };
  return                      { bg: "#EDE9FE", text: "#7C3AED", border: "#C4B5FD" };
}

/* ── Spec row ───────────────────────────────────────── */
function SpecRow({ label, value, i }: { label: string; value: string; i: number }) {
  return (
    <div
      className={`flex items-center justify-between py-3 px-4 text-sm ${
        i % 2 === 0 ? "bg-navy-50/50" : "bg-white"
      }`}
    >
      <span className="text-navy-400 font-medium">{label}</span>
      <span className="text-navy-950 font-semibold">{value}</span>
    </div>
  );
}

/* ── Review card ────────────────────────────────────── */
const REVIEWS = [
  {
    name: "Stavros P.",
    rating: 5,
    comment:
      "Incredible quality for the price. The appliance arrived perfectly packaged and works flawlessly from day one.",
    date: "Nov 2024",
  },
  {
    name: "Maria K.",
    rating: 5,
    comment:
      "Third open box purchase from Lamidis. Always impressed by the condition — and the 12-month warranty gives true peace of mind.",
    date: "Oct 2024",
  },
  {
    name: "Nikos A.",
    rating: 4,
    comment:
      "Great deal. Minor cosmetic mark that wasn't visible after installation. Very happy with the purchase overall.",
    date: "Sep 2024",
  },
];

/* ── Related product card ───────────────────────────── */
function RelatedCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-2xl border border-navy-100/70 overflow-hidden hover:border-navy-200 hover:shadow-card-lift transition-all duration-400 flex flex-col"
    >
      <div className="relative h-40 overflow-hidden">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={`${product.brand} ${product.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="300px"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div
          className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
          style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
        >
          −{product.savings}%
        </div>
      </div>
      <div className="p-4">
        <p className="text-navy-400 text-[10px] font-bold uppercase tracking-widest mb-1">{product.brand}</p>
        <p className="text-navy-950 font-semibold text-sm leading-snug mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>
          {product.model}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-navy-950 font-black text-lg" style={{ fontFamily: "var(--font-jakarta)" }}>
            €{product.salePrice.toLocaleString("el-GR")}
          </span>
          <span className="text-navy-300 text-xs line-through">€{product.originalPrice.toLocaleString("el-GR")}</span>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════ */
type Tab = "features" | "details" | "reviews";

export default function ProductDetail({ product }: { product: Product }) {
  const gc = gradeColor(product.grade);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("features");
  const [addedToCart, setAddedToCart] = useState(false);

  /* Simulate 4 thumbnails from the same image with different crops */
  const thumbs = [
    product.imageUrl,
    product.imageUrl ? `${product.imageUrl.split("?")[0]}?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop&crop=top` : "",
    product.imageUrl ? `${product.imageUrl.split("?")[0]}?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop&crop=center` : "",
    product.imageUrl ? `${product.imageUrl.split("?")[0]}?auto=compress&cs=tinysrgb&w=600&h=360&fit=crop&crop=bottom` : "",
  ].filter(Boolean);

  const activeImage = thumbs[activeThumb] ?? product.imageUrl;

  // Related products: same category, exclude current
  const related = FEATURED_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);
  const suggestions =
    related.length > 0
      ? related
      : FEATURED_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "features", label: "Features" },
    { key: "details", label: "Details & Specs" },
    { key: "reviews", label: `Reviews (${REVIEWS.length})` },
  ];

  return (
    <>
      {/* ── Breadcrumb / back ─────────────────────────── */}
      <div className="bg-navy-950 pt-24 pb-6 border-b border-white/[0.06]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-white/45 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <div className="flex items-center gap-2 mt-3 text-white/30 text-xs">
            <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white/60 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-white/60">{product.brand} {product.model}</span>
          </div>
        </div>
      </div>

      {/* ── Main product section ──────────────────────── */}
      <section className="bg-white section-py">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-start">

            {/* ── Left: Image + Thumbnails ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:sticky lg:top-28 flex flex-col gap-4"
            >
              {/* Main image */}
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_24px_64px_rgba(3,8,19,0.15)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeThumb}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    {activeImage ? (
                      <Image
                        src={activeImage}
                        alt={`${product.brand} ${product.model}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                    ) : (
                      <div
                        className="h-full"
                        style={{ background: `linear-gradient(135deg, ${product.colorFrom}25, ${product.colorTo}10)` }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Savings badge overlay */}
                <div
                  className="absolute top-5 left-5 text-sm font-bold px-3.5 py-1.5 rounded-full text-white shadow-lg z-10"
                  style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
                >
                  −{product.savings}% OFF
                </div>

                {/* Availability badge */}
                <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-emerald-700 text-[11px] font-bold px-3 py-1.5 rounded-full shadow z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock
                </div>
              </div>

              {/* Thumbnail strip */}
              {thumbs.length > 1 && (
                <div className="flex gap-2.5">
                  {thumbs.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveThumb(i)}
                      className={cn(
                        "relative flex-1 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-200",
                        activeThumb === i
                          ? "border-gold-500 shadow-md"
                          : "border-navy-100 hover:border-navy-200 opacity-60 hover:opacity-90"
                      )}
                    >
                      <Image
                        src={src}
                        alt={`View ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust mini-row below thumbnails */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield,    label: "12-Month Warranty" },
                  { icon: Truck,     label: "Free Delivery" },
                  { icon: RotateCcw, label: "30-Day Returns" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-navy-50 border border-navy-100/60 text-center"
                  >
                    <Icon className="w-4 h-4 text-gold-500" />
                    <span className="text-navy-600 text-[10px] font-semibold leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Right: Details ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-6"
            >
              {/* Brand + badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-navy-400">
                  {product.brand}
                </span>
                <span className="w-1 h-1 rounded-full bg-navy-200" />
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full border"
                  style={{ background: gc.bg, color: gc.text, borderColor: gc.border }}
                >
                  Grade {product.grade}
                </span>
                <span className="badge-blue text-[10px]">Open Box Certified</span>
              </div>

              {/* Product name */}
              <div>
                <h1
                  className="text-navy-950 font-black leading-[1.08] tracking-tighter"
                  style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
                >
                  {product.brand} {product.model}
                </h1>
              </div>

              {/* Stars (decorative) */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
                <span className="text-navy-400 text-sm font-medium ml-1">4.9</span>
                <span className="text-navy-300 text-sm">·</span>
                <span className="text-navy-400 text-sm">48 reviews</span>
              </div>

              {/* Pricing */}
              <div className="flex items-end gap-4 pb-5 border-b border-navy-100/60">
                <div>
                  <span className="text-navy-300 text-sm font-medium">Sale Price</span>
                  <div
                    className="text-navy-950 font-black leading-none mt-1"
                    style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2rem, 4vw, 3rem)" }}
                  >
                    €{product.salePrice.toLocaleString("el-GR")}
                  </div>
                </div>
                <div className="pb-1 flex flex-col gap-1">
                  <span className="text-navy-300 text-sm font-medium line-through">
                    €{product.originalPrice.toLocaleString("el-GR")}
                  </span>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
                  >
                    Save €{(product.originalPrice - product.salePrice).toLocaleString("el-GR")}
                  </span>
                </div>
              </div>

              {/* Availability + delivery */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <Package className="w-4 h-4" />
                  In Stock
                </div>
                <div className="flex items-center gap-1.5 text-navy-500 font-medium">
                  <Truck className="w-4 h-4 text-gold-500" />
                  Ships within 24–48h
                </div>
                <div className="flex items-center gap-1.5 text-navy-500 font-medium">
                  <Zap className="w-4 h-4 text-gold-500" />
                  Free delivery
                </div>
              </div>

              {/* Quantity + Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Quantity selector */}
                <div className="flex items-center gap-0 rounded-xl border border-navy-200 overflow-hidden h-11 shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-full flex items-center justify-center text-navy-500 hover:text-navy-950 hover:bg-navy-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span
                    className="w-12 text-center font-bold text-navy-950 text-sm border-x border-navy-200 h-full flex items-center justify-center"
                    style={{ fontFamily: "var(--font-jakarta)" }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-full flex items-center justify-center text-navy-500 hover:text-navy-950 hover:bg-navy-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2.5 h-11 rounded-xl font-bold text-sm transition-all duration-300",
                    addedToCart
                      ? "bg-emerald-500 text-white"
                      : "bg-gold-500 hover:bg-gold-600 text-white shadow-[0_4px_16px_rgba(58,95,138,0.35)] hover:shadow-[0_6px_24px_rgba(58,95,138,0.45)]"
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={addedToCart ? "added" : "add"}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {addedToCart ? "Added to Cart!" : "Add to Cart"}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>

              {/* Inquiry buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/contact" className="btn-gold text-sm flex-1 justify-center">
                  <Mail className="w-4 h-4" />
                  Send an Enquiry
                </Link>
                <a
                  href={`tel:${SITE_PHONE.replace(/\s+/g, "")}`}
                  className="btn-ghost-dark text-sm flex-1 justify-center"
                >
                  <Phone className="w-4 h-4" />
                  Call Us
                </a>
              </div>

              {/* Financing note */}
              <div className="flex items-center gap-2 text-xs text-navy-400 font-medium">
                <span className="w-4 h-px bg-navy-200" />
                Available on installment plan — ask us for details
                <span className="w-4 h-px bg-navy-200" />
              </div>

              {/* Warranty note */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-navy-50 border border-navy-100/60">
                <Award className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-navy-950 font-semibold text-sm">
                    12-Month Lamidis Warranty Included
                  </p>
                  <p className="text-navy-400 text-xs mt-0.5 leading-relaxed">
                    Full parts &amp; labor coverage. If anything goes wrong, we fix it — no questions asked.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Tabs: Features / Details / Reviews ─────────────── */}
      <section className="bg-white border-t border-navy-100/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Tab bar */}
          <div className="flex gap-0 border-b border-navy-100/60 overflow-x-auto scrollbar-none">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "relative flex-shrink-0 px-6 py-4 text-sm font-semibold transition-colors duration-200",
                  activeTab === key
                    ? "text-navy-950"
                    : "text-navy-400 hover:text-navy-700"
                )}
              >
                {label}
                {activeTab === key && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="py-10"
            >
              {/* ── Features ── */}
              {activeTab === "features" && (
                <div className="max-w-3xl">
                  <p className="text-navy-400 text-base leading-relaxed mb-8">
                    {product.description}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: `Grade ${product.grade} Certified`,
                        desc: "Thoroughly inspected and graded by our certified technicians to meet strict quality standards.",
                      },
                      {
                        title: `${product.warranty}-Month Warranty`,
                        desc: "Full Lamidis warranty covering parts and labour. Peace of mind from day one.",
                      },
                      {
                        title: "47-Point Inspection",
                        desc: "Every appliance passes our comprehensive 47-point quality inspection before sale.",
                      },
                      {
                        title: "Ready to Ship in 24–48h",
                        desc: "Stock checked daily. Your order is packaged and dispatched within two business days.",
                      },
                      {
                        title: "Free Delivery",
                        desc: "Complimentary doorstep delivery anywhere in Cyprus. White-glove service available.",
                      },
                      {
                        title: "30-Day Returns",
                        desc: "Not satisfied? Return within 30 days for a full refund, no questions asked.",
                      },
                    ].map(({ title, desc }) => (
                      <div
                        key={title}
                        className="flex gap-3 p-4 rounded-xl bg-navy-50/60 border border-navy-100/50"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-navy-950 font-semibold text-sm">{title}</p>
                          <p className="text-navy-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Details & Specs ── */}
              {activeTab === "details" && (
                <div className="max-w-2xl">
                  <p className="text-navy-900/60 text-base leading-relaxed mb-8">
                    {product.description}
                  </p>
                  {product.specs.length > 0 && (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className="w-1 h-5 rounded-full"
                          style={{ background: `linear-gradient(to bottom, ${product.colorFrom}, ${product.colorTo})` }}
                        />
                        <h3
                          className="text-navy-950 font-bold text-lg"
                          style={{ fontFamily: "var(--font-jakarta)" }}
                        >
                          Technical Specifications
                        </h3>
                      </div>
                      <div className="rounded-2xl overflow-hidden border border-navy-100/60">
                        {product.specs.map((spec, i) => (
                          <SpecRow key={spec.label} label={spec.label} value={spec.value} i={i} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── Reviews ── */}
              {activeTab === "reviews" && (
                <div className="max-w-3xl">
                  {/* Summary */}
                  <div className="flex items-center gap-6 mb-8 p-5 rounded-2xl bg-navy-50/60 border border-navy-100/50">
                    <div className="text-center">
                      <div
                        className="font-black text-5xl text-navy-950 leading-none"
                        style={{ fontFamily: "var(--font-jakarta)" }}
                      >
                        4.9
                      </div>
                      <div className="flex items-center justify-center gap-0.5 mt-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-navy-400 text-xs mt-1 font-medium">48 reviews</p>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const pct = stars === 5 ? 72 : stars === 4 ? 22 : stars === 3 ? 6 : 0;
                        return (
                          <div key={stars} className="flex items-center gap-2 text-xs">
                            <span className="text-navy-400 w-3 text-right">{stars}</span>
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <div className="flex-1 h-1.5 rounded-full bg-navy-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-amber-400"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-navy-400 w-7">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Individual reviews */}
                  <div className="flex flex-col gap-5">
                    {REVIEWS.map(({ name, rating, comment, date }) => (
                      <div
                        key={name}
                        className="p-5 rounded-2xl border border-navy-100/60 bg-white hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-navy-950 font-semibold text-sm">{name}</p>
                            <div className="flex items-center gap-0.5 mt-1">
                              {Array.from({ length: rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              ))}
                              {Array.from({ length: 5 - rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 text-navy-200 fill-navy-100" />
                              ))}
                            </div>
                          </div>
                          <span className="text-navy-300 text-xs font-medium">{date}</span>
                        </div>
                        <p className="text-navy-600 text-sm leading-relaxed">{comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Related products ──────────────────────────────── */}
      <section className="section-py" style={{ background: "#F8FAFF" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <AnimatedSection className="mb-10">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-navy-400 flex items-center gap-2 mb-3">
                  <span className="w-5 h-px bg-navy-200" />
                  You May Also Like
                </span>
                <h2
                  className="text-navy-950 font-bold text-2xl"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  Related Products
                </h2>
              </div>
              <Link href="/products" className="btn-ghost-dark text-sm hidden sm:flex">
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {suggestions.map((p) => (
              <StaggerItem key={p.id}>
                <RelatedCard product={p} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── Contact CTA ───────────────────────────────────── */}
      <section className="section-py bg-navy-950 noise-overlay relative overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <AnimatedSection className="text-center max-w-xl mx-auto">
            <h2
              className="text-white font-black text-3xl mb-4"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              Interested in This Product?
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">
              Our team is ready to answer any questions, arrange a viewing at our Limassol
              showroom, or organise fast delivery to your door.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="btn-gold text-sm">
                <Mail className="w-4 h-4" />
                Send an Enquiry
              </Link>
              <a href={`tel:${SITE_PHONE.replace(/\s+/g, "")}`} className="btn-ghost-white text-sm">
                <Phone className="w-4 h-4" />
                {SITE_PHONE}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
