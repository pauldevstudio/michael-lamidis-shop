import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/constants";

/**
 * "Best Deals" band at the top of the Products page — the same curated promo
 * items shown in the homepage popup (from the admin Promo Popup builder).
 * Renders nothing when no items are curated.
 */
export default function BestDeals({ items }: { items: Product[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section id="best-deals" className="bg-white border-b border-navy-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          <span className="text-gold-600 text-xs font-bold uppercase tracking-widest">Special Offer</span>
        </div>
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="text-navy-950 font-display font-bold text-2xl sm:text-3xl">Best Deals</h2>
          <Link href="/products" className="shrink-0 text-sm font-semibold text-navy-600 hover:text-gold-600 inline-flex items-center gap-1 transition-colors">
            All products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group rounded-2xl border border-navy-100 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="relative aspect-square bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imageUrl} alt={`${p.brand} ${p.model}`} className="absolute inset-0 w-full h-full object-contain p-3" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gold-500 text-white text-[10px] font-black tracking-wide shadow">DEAL</span>
              </div>
              <div className="p-3">
                <p className="text-navy-600 text-[11px] font-semibold uppercase tracking-wide truncate">{p.brand}</p>
                <p className="text-navy-950 text-sm font-medium truncate">{p.model}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-navy-950 font-bold tabular-nums">&euro;{p.salePrice.toLocaleString("en-US")}</span>
                  <span className="text-gold-600 text-xs font-semibold inline-flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                    Shop <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
