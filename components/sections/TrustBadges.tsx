"use client";

import { ShieldCheck, Award, Truck, RefreshCw, CheckCircle2, RotateCcw, Star } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";
import { StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";

const ICONS: Record<string, React.ElementType> = {
  ShieldCheck, Award, Truck, RefreshCw, CheckCircle2, RotateCcw, Star,
};

export default function TrustBadges() {
  const { t } = useLanguage();
  const __content = useContent();
  const __tb = __content?.trustBadges;
  const __tbEyebrow = __tb?.eyebrow ?? t.trust.eyebrow;
  const __tbTitle   = __tb?.title   ?? t.trust.title;
  const __tbItems   = (__tb?.items && __tb.items.length > 0) ? __tb.items : t.trust.items;

  return (
    <section className="bg-white section-py">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <SectionHeader
          eyebrow={__tbEyebrow}
          title={__tbTitle}
          theme="light"
          className="mb-14"
        />

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {__tbItems.map(({ icon, title, description }) => {
            const Icon = ICONS[icon];
            return (
              <StaggerItem key={title}>
                <div className="group relative flex flex-col gap-4 p-7 rounded-2xl border border-navy-100/60 bg-gradient-to-b from-navy-50/40 to-white hover:border-navy-200 hover:shadow-card-lift transition-all duration-400 cursor-default overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl" />
                  <div className="relative w-12 h-12 rounded-xl bg-navy-950 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold-500/20 to-transparent" />
                    {Icon && <Icon className="w-5 h-5 text-gold-400 relative z-10" />}
                  </div>
                  <div className="flex flex-col gap-2 relative z-10">
                    <h3 className="text-navy-950 font-display font-bold text-base leading-snug" style={{ fontFamily: "var(--font-jakarta)" }}>
                      {title}
                    </h3>
                    <p className="text-navy-900/50 text-sm leading-relaxed">{description}</p>
                  </div>
                  <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-50">
          {["Samsung", "LG", "Bosch", "Miele", "Siemens", "Electrolux", "Philips"].map((brand) => (
            <span key={brand} className="text-navy-900 font-display font-bold text-sm tracking-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
