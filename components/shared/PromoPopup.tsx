"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Sparkles, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/constants";
import { useContent } from "@/lib/content-context";
import { useLanguage } from "@/lib/i18n-context";

const SHOW_DELAY_MS = 2500;

export default function PromoPopup({ items }: { items: Product[] }) {
  const content = useContent();
  const promo = content?.promoPopup;
  const { t, pick } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!promo?.enabled || items.length === 0) return;
    const force =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("promo");
    const t = setTimeout(() => setOpen(true), force ? 0 : SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [promo?.enabled, items.length]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab") return;
      const dialog = closeRef.current?.closest('[role="dialog"]');
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted || !open || !promo) return null;

  const featured = items[Math.floor(Math.random() * items.length)];
  if (!featured) return null;

  const discount = featured.originalPrice > featured.salePrice
    ? Math.round(((featured.originalPrice - featured.salePrice) / featured.originalPrice) * 100)
    : 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[10050] flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-popup-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl"
        style={{ background: "linear-gradient(180deg, #030813 0%, #071233 100%)" }}
      >
        {/* Close */}
        <button
          ref={closeRef}
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Eyebrow — compact */}
        <div className="px-5 pt-6 pb-3 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-400 text-[11px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            {pick(promo.eyebrow, t.promoPopup.eyebrow)}
          </span>
        </div>

        {/* Product — maximum image, minimal text */}
        <div className="px-4 pb-3">
          <div className="rounded-2xl bg-white overflow-hidden">
            {/* Full-bleed product image */}
            <div className="relative w-full aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.imageUrl}
                alt={`${featured.brand} ${featured.model}`}
                className="absolute inset-0 w-full h-full object-contain p-4"
              />
              {discount > 0 && (
                <span className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-red-500 text-xs font-extrabold text-white shadow-lg">
                  &minus;{discount}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Name + Price + CTA — tight */}
        <div className="px-5 pb-6 text-center space-y-3">
          <div>
            <p className="text-white font-bold text-lg sm:text-xl leading-snug">
              {featured.brand}
            </p>
            <div className="mt-1.5 flex items-baseline justify-center gap-2.5">
              <span className="text-gold-400 font-extrabold text-2xl sm:text-3xl tabular-nums">
                &euro;{featured.salePrice.toLocaleString("en-US")}
              </span>
              {discount > 0 && (
                <span className="text-white/50 line-through text-sm tabular-nums">
                  &euro;{featured.originalPrice.toLocaleString("en-US")}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/products/${featured.id}`}
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl text-navy-950 text-sm font-bold transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #E6B450 0%, #C8881A 100%)" }}
          >
            {t.promoPopup.shop} <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href={promo.ctaHref || "/products?category=best-deals"}
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center gap-1.5 text-white/50 hover:text-gold-400 text-xs font-medium transition-colors"
          >
            {pick(promo.ctaLabel, t.promoPopup.cta)} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
