"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Sparkles, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/constants";
import { useContent } from "@/lib/content-context";

const SEEN_KEY = "ml_promo_popup_seen";
const SHOW_DELAY_MS = 2500;

/** Local YYYY-M-D key, used to throttle the popup to once per day per visitor. */
function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * Homepage "Special Offer" promo popup. Showcases the products flagged with the
 * per-product `promo` toggle (fetched server-side and passed in as `items`) and
 * links each straight to its purchase page. Copy + on/off come from the CMS
 * (`promoPopup`, edited at /admin/content). Shows once per day per visitor; add
 * `?promo=1` to the URL to force it (handy for previewing). Portaled to <body>
 * so the homepage's framer-motion transforms don't break `position: fixed`.
 */
export default function PromoPopup({ items }: { items: Product[] }) {
  const content = useContent();
  const promo = content?.promoPopup;
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  // Show if enabled + has items + not already seen today (unless ?promo=1 forces it).
  useEffect(() => {
    if (!promo?.enabled || items.length === 0) return;
    const force =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("promo");
    if (!force) {
      try {
        if (localStorage.getItem(SEEN_KEY) === todayKey()) return;
      } catch { /* private mode — fall through and show */ }
    }
    const t = setTimeout(() => setOpen(true), force ? 0 : SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [promo?.enabled, items.length]);

  // While open: mark seen for the day, lock body scroll, focus close, Esc closes.
  useEffect(() => {
    if (!open) return;
    try { localStorage.setItem(SEEN_KEY, todayKey()); } catch { /* ignore */ }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted || !open || !promo) return null;

  const shown = items.slice(0, 4);

  return createPortal(
    <div
      className="fixed inset-0 z-[10050] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-popup-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl"
        style={{ background: "linear-gradient(180deg, #030813 0%, #071233 100%)" }}
      >
        <button
          ref={closeRef}
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="px-6 pt-8 pb-5 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-400 text-[11px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            {promo.eyebrow || "Special Offer"}
          </span>
          <h2 id="promo-popup-title" className="mt-3 text-white font-display font-bold text-2xl sm:text-3xl leading-tight">
            {promo.title || "This Week's Best Deals"}
          </h2>
          {promo.message && (
            <p className="mt-2 text-white/55 text-sm max-w-md mx-auto leading-relaxed">{promo.message}</p>
          )}
        </div>

        {/* Curated promo products */}
        <div className="px-6 pb-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {shown.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              onClick={() => setOpen(false)}
              className="group flex flex-col rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 overflow-hidden transition-colors"
            >
              <div className="relative aspect-square bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imageUrl}
                  alt={`${p.brand} ${p.model}`}
                  className="absolute inset-0 w-full h-full object-contain p-2"
                />
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-navy-950/80 text-[9px] font-bold text-white tracking-wide">
                  Grade {p.grade}
                </span>
              </div>
              <div className="p-2.5 flex flex-col gap-0.5">
                <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wide truncate">{p.brand}</p>
                <p className="text-white text-xs font-medium truncate">{p.model}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-gold-400 font-bold text-sm tabular-nums">
                    &euro;{p.salePrice.toLocaleString("en-US")}
                  </span>
                  <span className="text-white/40 group-hover:text-gold-400 text-[10px] font-semibold inline-flex items-center gap-0.5 transition-colors">
                    Shop <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="px-6 pt-4 pb-7 text-center">
          <Link
            href={promo.ctaHref || "/products"}
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-navy-950 text-sm font-bold transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #E6B450 0%, #C8881A 100%)" }}
          >
            {promo.ctaLabel || "See all deals"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
