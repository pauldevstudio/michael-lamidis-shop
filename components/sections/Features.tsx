"use client";

import {
  Tag, CheckCircle2, Zap, Recycle, Star, HeartHandshake, Shield, Truck,
} from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";
import { StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";

const ICONS: Record<string, React.ElementType> = {
  Tag, CheckCircle2, Zap, Recycle, Star, HeartHandshake, Shield, Truck,
};

const ICON_COLORS = [
  { bg: "from-blue-600 to-blue-500", glow: "rgba(37,99,235,0.25)" },
  { bg: "from-emerald-600 to-emerald-500", glow: "rgba(5,150,105,0.25)" },
  { bg: "from-amber-500 to-amber-400", glow: "rgba(245,158,11,0.25)" },
  { bg: "from-teal-600 to-teal-500", glow: "rgba(15,118,110,0.25)" },
  { bg: "from-violet-600 to-violet-500", glow: "rgba(124,58,237,0.25)" },
  { bg: "from-rose-500 to-rose-400", glow: "rgba(239,68,68,0.25)" },
];

export default function Features() {
  const { t } = useLanguage();
  const __content = useContent();
  const __fs = __content?.features;
  const __fsEyebrow  = __fs?.eyebrow  ?? t.features.eyebrow;
  const __fsTitle    = __fs?.title    ?? t.features.title;
  const __fsSubtitle = __fs?.subtitle ?? t.features.subtitle;
  const __fsItems    = (__fs?.items && __fs.items.length > 0) ? __fs.items : t.features.items;

  return (
    <section className="bg-navy-950 noise-overlay section-py relative overflow-hidden">
      <div className="absolute inset-0 dot-grid-bg opacity-100" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(30,72,184,0.2) 0%, transparent 70%)" }}
      />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,136,26,0.12) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
          <SectionHeader
            eyebrow={__fsEyebrow}
            title={__fsTitle}
            subtitle={__fsSubtitle}
            theme="dark"
            align="left"
            className="lg:max-w-2xl"
          />
          <Link href="/services" className="btn-gold text-sm shrink-0">
            {t.nav.services}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {__fsItems.map(({ icon, title, description }, i) => {
            const Icon = ICONS[icon];
            const color = ICON_COLORS[i % ICON_COLORS.length];
            return (
              <StaggerItem key={title}>
                <div className="group glass-card rounded-2xl p-6 h-full flex flex-col gap-4 hover:border-white/20 transition-all duration-400 cursor-default">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color.bg} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                    style={{ boxShadow: `0 8px 24px ${color.glow}` }}
                  >
                    {Icon && <Icon className="w-5 h-5 text-white" />}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white font-semibold text-base leading-snug" style={{ fontFamily: "var(--font-jakarta)" }}>
                      {title}
                    </h3>
                    <p className="text-white/45 text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
