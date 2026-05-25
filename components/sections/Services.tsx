"use client";

import { Search, Wrench, Settings, Package, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";
import { StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  Search, Wrench, Settings, Package,
};

const SERVICE_COLORS = [
  { accent: "#1E48B8", light: "rgba(30,72,184,0.08)", border: "rgba(30,72,184,0.2)" },
  { accent: "#0F766E", light: "rgba(15,118,110,0.08)", border: "rgba(15,118,110,0.2)" },
  { accent: "#7C3AED", light: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)" },
  { accent: "#C8881A", light: "rgba(200,136,26,0.08)", border: "rgba(200,136,26,0.2)" },
];

export default function Services() {
  const { t, lang, pick } = useLanguage();
  const __content = useContent();
  const __s = __content?.services;
  const __cms = {
    eyebrow:  pick(__s?.eyebrow,  t.services.eyebrow),
    title:    pick(__s?.title,    t.services.title),
    subtitle: pick(__s?.subtitle, t.services.subtitle),
    items:    (lang === "en" && __s?.items && __s.items.length > 0) ? __s.items : t.services.items,
  };

  return (
    <section className="bg-off-white section-py" style={{ background: "#F8FAFF" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <SectionHeader
          eyebrow={__cms.eyebrow}
          title={__cms.title}
          subtitle={__cms.subtitle}
          theme="light"
          className="mb-14"
        />

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {__cms.items.map(({ icon, title, description, price, badge }, i) => {
            const Icon = ICONS[icon];
            const color = SERVICE_COLORS[i % SERVICE_COLORS.length];
            return (
              <StaggerItem key={title}>
                <div
                  className={cn(
                    "group relative flex flex-col gap-5 p-7 rounded-2xl border bg-white transition-all duration-400 hover:-translate-y-1 cursor-default overflow-hidden h-full",
                    i === 0 ? "border-blue-200 shadow-md" : "border-navy-100/60"
                  )}
                  style={i === 0 ? { boxShadow: "0 8px 40px rgba(30,72,184,0.12)" } : {}}
                >
                  {/* Badge */}
                  {badge && (
                    <span
                      className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: color.light, color: color.accent, border: `1px solid ${color.border}` }}
                    >
                      {badge}
                    </span>
                  )}

                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                    style={{ background: color.light, border: `1px solid ${color.border}` }}
                  >
                    {Icon && <Icon className="w-5 h-5" style={{ color: color.accent }} />}
                  </div>

                  <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-navy-950 font-display font-bold text-base leading-snug" style={{ fontFamily: "var(--font-jakarta)" }}>
                      {title}
                    </h3>
                    <p className="text-navy-900/50 text-sm leading-relaxed">{description}</p>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-navy-100/50">
                    <span className="font-display font-bold text-sm" style={{ color: color.accent, fontFamily: "var(--font-jakarta)" }}>
                      {price}
                    </span>
                    <Link
                      href="/contact"
                      className="flex items-center gap-1 text-xs font-semibold text-navy-400 hover:text-navy-700 transition-colors"
                    >
                      Book now <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {["30-Day Returns", "Price Match Guarantee", "Expert Advice"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-navy-900/55 text-xs font-medium">{item}</span>
              </div>
            ))}
          </div>
          <div className="w-px h-4 bg-navy-200 hidden sm:block" />
          <Link href="/services" className="btn-primary text-sm">
            See All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
