"use client";

import { motion } from "framer-motion";
import { Search, Wrench, Settings, Package, ArrowRight, CheckCircle, Star } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import SectionHeader from "@/components/shared/SectionHeader";
import { StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import ProductGallery from "@/components/sections/ProductGallery";
import FAQ from "@/components/sections/FAQ";
import LeadCapture from "@/components/sections/LeadCapture";

const SERVICE_ICONS: Record<string, React.ElementType> = { Search, Wrench, Settings, Package };
const COLORS = [
  { from: "#1E48B8", to: "#3D62CC", bg: "rgba(30,72,184,0.08)", border: "rgba(30,72,184,0.2)" },
  { from: "#0F766E", to: "#14B8A6", bg: "rgba(15,118,110,0.08)", border: "rgba(15,118,110,0.2)" },
  { from: "#7C3AED", to: "#A78BFA", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)" },
  { from: "#C8881A", to: "#DFA020", bg: "rgba(200,136,26,0.08)", border: "rgba(200,136,26,0.2)" },
];

export default function ServicesContent() {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[46vh] flex items-end bg-navy-900 overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 40% 90%, rgba(59,130,246,0.06) 0%, transparent 55%)" }}
        />
        <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl">
          <motion.span
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm text-white/75 text-[11px] font-medium tracking-[0.12em] uppercase mb-7"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
            {t.pages.services.badge}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-white leading-[1.06] tracking-[-0.025em] max-w-3xl"
            style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
          >
            {t.pages.services.titleLine1}{" "}
            <span className="text-blue-400">{t.pages.services.titleLine2}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/55 text-[0.95rem] sm:text-[1.05rem] leading-[1.7] max-w-[480px] mt-5"
          >
            {t.pages.services.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-white section-py">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <StaggerChildren className="grid sm:grid-cols-2 gap-6">
            {t.services.items.map(({ icon, title, description, price, badge }, i) => {
              const Icon = SERVICE_ICONS[icon];
              const c = COLORS[i % COLORS.length];
              return (
                <StaggerItem key={title}>
                  <div
                    className="group relative flex flex-col gap-6 p-8 rounded-2xl border bg-white hover:-translate-y-1 hover:shadow-card-lift transition-all duration-400 overflow-hidden h-full"
                    id={title.toLowerCase().replace(/\s+/g, "-")}
                    style={{ borderColor: c.border }}
                  >
                    {badge && (
                      <span className="absolute top-5 right-5 text-[10px] font-bold px-3 py-1 rounded-full"
                        style={{ background: c.bg, color: c.from, border: `1px solid ${c.border}` }}>
                        {badge}
                      </span>
                    )}
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}>
                        {Icon && <Icon className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <p className="text-navy-950 font-display font-bold text-xl" style={{ fontFamily: "var(--font-jakarta)" }}>{title}</p>
                        <p className="font-bold text-base mt-0.5" style={{ color: c.from }}>{price}</p>
                      </div>
                    </div>
                    <p className="text-navy-900/65 text-base leading-relaxed">{description}</p>
                    <ul className="flex flex-col gap-2">
                      {t.pages.services.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-navy-900/65">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact" className="btn-ghost-dark text-sm w-fit mt-auto">
                      {t.pages.services.bookCta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      <ProductGallery />
      <FAQ />
      <LeadCapture />
    </>
  );
}
