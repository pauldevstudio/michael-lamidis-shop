"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown, ShieldCheck, Award, Truck, ArrowRight, MapPin, Play,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";
import {
  HERO_IMAGE,
  HERO_FRIDGE_IMAGE,
  HERO_WASHER_IMAGE,
  HERO_OVEN_IMAGE,
} from "@/lib/constants";
import dynamic from "next/dynamic";
const ShowroomVideoModal = dynamic(() => import("@/components/shared/ShowroomVideoModal"), { ssr: false });


/* ── Floating product card ─────────────────────────────── */
interface FloatCardProps {
  imgSrc: string;
  imgAlt: string;
  brand: string;
  model: string;
  original: string;
  sale: string;
  badge: string;
  badgeColor: string;
  floatDir: "up" | "down";
  delay?: number;
}
function FloatCard({
  imgSrc, imgAlt, brand, model, original, sale,
  badge, badgeColor, floatDir, delay = 0,
}: FloatCardProps) {
  return (
    <motion.div
      animate={{ y: floatDir === "up" ? [0, -7, 0] : [0, 7, 0] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className="relative rounded-xl overflow-hidden border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.52)]"
      style={{ backdropFilter: "blur(6px)" }}
    >
      {/* Photo */}
      <div className="relative h-36">
        <Image
          src={imgSrc}
          alt={imgAlt}
          fill
          loading="lazy"
          className="object-cover"
          sizes="360px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
      </div>

      {/* Info strip */}
      <div className="absolute bottom-0 left-0 right-0 px-3.5 py-2.5 flex items-end justify-between">
        <div>
          <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest">{brand}</p>
          <p className="text-white font-semibold text-[11px] leading-snug" style={{ fontFamily: "var(--font-jakarta)" }}>
            {model}
          </p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-white/50 text-[9px] line-through">{original}</span>
          <span className="text-gold-400 font-black text-sm" style={{ fontFamily: "var(--font-jakarta)" }}>
            {sale}
          </span>
        </div>
      </div>

      {/* Badge */}
      <div
        className="absolute top-2.5 right-2.5 text-white text-[9px] font-bold px-2 py-0.5 rounded-full"
        style={{ background: badgeColor }}
      >
        {badge}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function Hero() {
  const { t, pick, lang } = useLanguage();
  const [showroomOpen, setShowroomOpen] = useState(false);
  // CMS-driven hero content (Payload home-hero global), but Greek prefers the i18n strings.
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
      {/* ── Background image — Ken Burns zoom-out ─────── */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.07 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
      >
        <Image
          src={__h?.imageUrl || HERO_IMAGE}
          alt="Premium open box home appliance lineup — washing machine, refrigerator, oven, smart TV, microwave and vacuum — Michael Lamidis, Limassol Cyprus"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      {/* ── Overlays (3-layer system) ─────────────────── */}
      {/* Main: left-heavy for copy readability */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(110deg, rgba(3,8,19,0.92) 0%, rgba(3,8,19,0.72) 35%, rgba(3,8,19,0.40) 62%, rgba(3,8,19,0.20) 100%)",
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{
          height: "220px",
          background:
            "linear-gradient(to top, rgba(3,8,19,0.97) 0%, rgba(3,8,19,0.52) 50%, transparent 100%)",
        }}
      />
      {/* Top fade → navbar */}
      <div
        className="absolute top-0 left-0 right-0 z-10"
        style={{
          height: "160px",
          background:
            "linear-gradient(to bottom, rgba(3,8,19,0.55) 0%, transparent 100%)",
        }}
      />

      {/* ── Main content ─────────────────────────────────── */}
      <div className="relative z-20 flex-1 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24">
          <div className="flex items-center gap-8 xl:gap-14">

            {/* ── Left: copy block ── */}
            <div className="flex-1 max-w-xl sm:max-w-2xl lg:max-w-[54%]">

              {/* Location badge — CSS animation (server-visible for LCP) */}
              <div className="hero-animate hero-animate-1">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/35 bg-gold-500/12 text-gold-400 text-[11px] font-bold tracking-[0.18em] uppercase">
                  <MapPin className="w-3 h-3" />
                  {__cms.locationLabel}
                  <span className="w-1 h-1 rounded-full bg-gold-400/60" />
                  {__cms.badge}
                </span>
              </div>

              {/* Headline — plain <h1>, CSS animation so it's visible in SSR */}
              <h1
                className="hero-animate hero-animate-2 font-display font-black text-white leading-[1.04] tracking-tight mt-5"
                style={{
                  fontFamily: "var(--font-jakarta)",
                  fontSize: "clamp(2rem, 5vw, 4.5rem)",
                }}
              >
                {__cms.titleLine1}
                <br />
                <span className="text-gradient-gold">{__cms.titleLine2}</span>
              </h1>

              {/* Subheadline */}
              <p className="hero-animate hero-animate-3 text-white/60 text-base sm:text-[1.1rem] leading-relaxed mt-5 max-w-lg font-medium">
                {__cms.subtitle}
              </p>

              {/* CTAs */}
              <div className="hero-animate hero-animate-4 flex flex-wrap items-center gap-3 mt-8">
                <Link href={__cms.primaryCtaHref} className="btn-gold text-sm sm:text-base !px-7 !py-3.5 w-full sm:w-auto justify-center">
                  {__cms.primaryCtaLabel ?? t.hero.cta1}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowroomOpen(true)}
                  className="btn-ghost-white text-sm sm:text-base !px-7 !py-3.5 w-full sm:w-auto justify-center"
                >
                  <Play className="w-4 h-4" />
                  View Our Showroom
                </button>
              </div>

              {/* Showroom video modal — lazy loaded */}
              {showroomOpen && <ShowroomVideoModal open={showroomOpen} onClose={() => setShowroomOpen(false)} src="/showroom.mp4" />}

              {/* Trust micro-row */}
              <div className="hero-animate hero-animate-5 flex flex-wrap items-center gap-x-6 gap-y-2 mt-7">
                {[ShieldCheck, Award, Truck].map((Icon, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span className="text-white/50 text-xs font-medium">{t.hero.trustItems[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: floating product cards (desktop only) ── */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.05, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex flex-col gap-3.5 flex-1 max-w-[320px] xl:max-w-[360px]"
            >
              <FloatCard
                imgSrc={HERO_FRIDGE_IMAGE}
                imgAlt="Premium stainless steel French door refrigerator"
                brand="Premium"
                model="RS68A8820WW Refrigerator"
                original="€1,499"
                sale="€699"
                badge="Grade A · −53%"
                badgeColor="#047857"
                floatDir="up"
                delay={0}
              />
              <FloatCard
                imgSrc={HERO_OVEN_IMAGE}
                imgAlt="Built-in electric oven with modern cabinetry in luxury kitchen"
                brand="Premium"
                model="HB578ABS0 Built-in Oven"
                original="€1,199"
                sale="€549"
                badge="Grade A+ · −54%"
                badgeColor="#6d28d9"
                floatDir="down"
                delay={0.4}
              />
              <FloatCard
                imgSrc={HERO_WASHER_IMAGE}
                imgAlt="Premium front-load washing machine in modern laundry room"
                brand="Premium"
                model="WAX32EH0GR Washer"
                original="€899"
                sale="€449"
                badge="Grade A+ · −50%"
                badgeColor="#6d28d9"
                floatDir="up"
                delay={0.8}
              />
            </motion.div>

          </div>
        </div>
      </div>


      {/* ── Scroll indicator ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-20"
      >
        <span className="text-white/50 text-[10px] tracking-[0.22em] uppercase font-semibold">
          {t.hero.scrollHint}
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
