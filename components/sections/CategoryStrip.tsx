"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Square,
  RefreshCw,
  Flame,
  Droplets,
  Wind,
  CookingPot,
  Coffee,
  Snowflake,
  Bed,
  Sofa,
  Wrench,
  Utensils,
  Bike,
  Dumbbell,
  PawPrint,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";

const ICONS: Record<string, React.ElementType> = {
  all: LayoutGrid,
  refrigerators: Square,
  "washing-machines": RefreshCw,
  ovens: Flame,
  dishwashers: Droplets,
  "air-conditioners": Wind,
  freezers: Snowflake,
  cookware: CookingPot,
  "small-appliances": Coffee,
  mattresses: Bed,
  furniture: Sofa,
  tools: Wrench,
  kitchenware: Utensils,
  bicycles: Bike,
  "fitness-equipment": Dumbbell,
  "pet-accessories": PawPrint,
};

const COLORS: Record<string, { from: string; to: string }> = {
  all: { from: "#1E48B8", to: "#3D62CC" },
  refrigerators: { from: "#0F766E", to: "#14B8A6" },
  "washing-machines": { from: "#7C3AED", to: "#A78BFA" },
  ovens: { from: "#C2410C", to: "#F97316" },
  dishwashers: { from: "#1D4ED8", to: "#60A5FA" },
  "air-conditioners": { from: "#0369A1", to: "#38BDF8" },
  freezers: { from: "#0E7490", to: "#22D3EE" },
  cookware: { from: "#B45309", to: "#F59E0B" },
  "small-appliances": { from: "#9D174D", to: "#F472B6" },
  mattresses: { from: "#475569", to: "#94A3B8" },
  furniture: { from: "#854D0E", to: "#A16207" },
  tools: { from: "#991B1B", to: "#DC2626" },
  kitchenware: { from: "#65A30D", to: "#84CC16" },
  bicycles: { from: "#1E40AF", to: "#3B82F6" },
  "fitness-equipment": { from: "#DC2626", to: "#F87171" },
  "pet-accessories": { from: "#D97706", to: "#FBBF24" },
};

const DEFAULT_COLOR = { from: "#475569", to: "#94A3B8" };

const FALLBACK_ITEMS = [
  { id: "all", label: "All Products" },
  { id: "refrigerators", label: "Refrigerators" },
  { id: "washing-machines", label: "Washers" },
  { id: "ovens", label: "Ovens" },
  { id: "dishwashers", label: "Dishwashers" },
  { id: "air-conditioners", label: "Air Conditioning" },
  { id: "cookware", label: "Cookware" },
  { id: "small-appliances", label: "Small Appliances" },
];

export default function CategoryStrip() {
  const { t, lang, pick } = useLanguage();
  const __content = useContent();
  const __cs = __content?.categoryStrip;
  const eyebrow = pick(__cs?.eyebrow, t?.categoryStrip?.eyebrow) ?? "Shop by Category";
  const items = (lang === "en" && __cs?.items && __cs.items.length > 0)
    ? __cs.items
    : (t?.categoryStrip?.items ?? FALLBACK_ITEMS);

  return (
    <section className="bg-white border-b border-navy-100/60 py-8 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-navy-400 mb-6">
          {eyebrow}
        </p>

        <div className="flex items-start gap-5 sm:gap-8 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center snap-x snap-mandatory sm:snap-none px-1">
          {items.map(({ id, label }, i) => {
            const Icon = ICONS[id] ?? LayoutGrid;
            const color = COLORS[id] ?? DEFAULT_COLOR;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex-shrink-0 snap-start"
              >
                <Link
                  href={id === "all" ? "/products" : `/products?cat=${id}`}
                  className="group flex flex-col items-center gap-2.5 w-[72px]"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300"
                    style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
                  >
                    {Icon && <Icon className="w-6 h-6 text-white" strokeWidth={1.75} />}
                  </div>

                  <span className="text-navy-500 group-hover:text-navy-950 text-[11px] font-semibold leading-tight text-center transition-colors duration-200 line-clamp-2">
                    {label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
