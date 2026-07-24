"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown, ShieldCheck, Award, Truck, ArrowRight, MapPin, Play,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";
import {
  HERO_IMAGE,
  SITE_MAPS_URL,
} from "@/lib/constants";
import dynamic from "next/dynamic";
const ShowroomVideoModal = dynamic(() => import("@/components/shared/ShowroomVideoModal"), { ssr: false });

/* ═══════════════════════════════════════════════════════ */
export default function Hero() {
  const { t, pick, lang } = useLanguage();
  const [showroomOpen, setShowroomOpen] = useState(false);
  const __content = useContent();
  const __h = __content?.hero;
  const __rawHeadline: string =
    lang === "en" && __h?.headline && __h.headline.length > 0
      ? __h.headline
      : `${t.hero.titleLine1}\n${t.hero.titleLine2}`;
  const __headlineLines: string[] = __rawHeadline.split("\n");
  const __cms = {
    locationLabel:     pick(__h?.locationLabel, t.hero.locationLabel)!,
    badge:             pick(__h?.badge, t.hero.badge)!,
    titleLine1:        __headlineLines[0]     ?? t.hero.titleLine1,
    titleLine2:        __headlineLines.slice(1).join(" ") || t.hero.titleLine2,
    subtitle:          pick(__h?.subheadline, t.hero.subtitle)!,
    primaryCtaLabel:   pick(__h?.primaryCtaLabel, t.hero.cta1),
    primaryCtaHref:    __h?.primaryCtaHref   ?? "/products",
    secondaryCtaLabel: pick(__h?.secondaryCtaLabel, t.hero.cta2),
    secondaryCtaHref:  __h?.secondaryCtaHref ?? "/products",
  };

  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{ height: "100svh", minHeight: "660px" }}
    >
      {/* Background image — CSS zoom avoids framer-motion on the LCP path */}
      <div className="absolute inset-0 z-0 hero-zoom">
        <Image
          src={__h?.imageUrl || HERO_IMAGE}
          alt="Premium open box home appliance lineup — washing machine, refrigerator, oven, smart TV, microwave and vacuum — Michael Lamidis, Limassol Cyprus"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Overlay — left-weighted for copy readability, right side lets image breathe */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(105deg, rgba(3,8,19,0.80) 0%, rgba(3,8,19,0.52) 40%, rgba(3,8,19,0.18) 68%, rgba(3,8,19,0.06) 100%)",
        }}
      />
      {/* Bottom fade for scroll indicator legibility */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{
          height: "120px",
          background: "linear-gradient(to top, rgba(3,8,19,0.6) 0%, transparent 100%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-20 flex-1 flex items-center">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl pt-20 sm:pt-24">

          {/* Copy block */}
          <div className="max-w-xl sm:max-w-2xl lg:max-w-[620px]">

            {/* Location badge */}
            <div className="hero-animate hero-animate-1">
              <a
                href={SITE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm text-white/75 text-[11px] font-medium tracking-[0.12em] uppercase hover:bg-white/12 transition-colors"
              >
                <MapPin className="w-3 h-3 opacity-70" />
                {__cms.locationLabel}
                <span className="w-1 h-1 rounded-full bg-white/40" />
                {__cms.badge}
              </a>
            </div>

            {/* Headline */}
            <h1
              className="hero-animate hero-animate-2 font-display font-black text-white leading-[1.06] tracking-[-0.025em] mt-7"
              style={{
                fontFamily: "var(--font-jakarta)",
                fontSize: "clamp(2.2rem, 5vw, 4.25rem)",
              }}
            >
              {__cms.titleLine1}
              <br />
              <span className="text-blue-400">{__cms.titleLine2}</span>
            </h1>

            {/* Subheadline */}
            <p className="hero-animate hero-animate-3 text-white/60 text-[0.95rem] sm:text-[1.05rem] leading-[1.7] mt-6 max-w-[480px]">
              {__cms.subtitle}
            </p>

            {/* CTAs */}
            <div className="hero-animate hero-animate-4 flex flex-wrap items-center gap-3 mt-10">
              <Link
                href={__cms.primaryCtaHref}
                className="inline-flex items-center justify-center gap-2.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-[0.9rem] font-semibold px-7 py-3 rounded-xl transition-colors duration-200 w-full sm:w-auto shadow-[0_2px_8px_rgba(59,130,246,0.25)]"
              >
                {__cms.primaryCtaLabel ?? t.hero.cta1}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => setShowroomOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 border border-white/18 hover:bg-white/8 active:bg-white/12 text-white/90 text-[0.9rem] font-medium px-7 py-3 rounded-xl transition-colors duration-200 w-full sm:w-auto"
              >
                <Play className="w-3.5 h-3.5 opacity-80" />
                View Our Showroom
              </button>
            </div>

            {showroomOpen && <ShowroomVideoModal open={showroomOpen} onClose={() => setShowroomOpen(false)} src="/showroom.mp4" />}

            {/* Trust micro-row */}
            <div className="hero-animate hero-animate-5 flex flex-wrap items-center gap-x-5 gap-y-2 mt-9">
              {[ShieldCheck, Award, Truck].map((Icon, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-white/40 shrink-0" />
                  <span className="text-white/45 text-[11px] font-medium tracking-wide">{t.hero.trustItems[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator — CSS animations, no framer-motion */}
      <div className="hero-scroll-indicator absolute bottom-7 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 z-20">
        <span className="text-white/35 text-[10px] tracking-[0.2em] uppercase font-medium">
          {t.hero.scrollHint}
        </span>
        <div className="hero-scroll-bounce">
          <ChevronDown className="w-4 h-4 text-white/35" />
        </div>
      </div>
    </section>
  );
}
