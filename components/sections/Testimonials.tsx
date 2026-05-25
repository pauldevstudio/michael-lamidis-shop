"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";
import SectionHeader from "@/components/shared/SectionHeader";
import { cn } from "@/lib/utils";

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { t } = useLanguage();
  // CMS overlay: prefer Payload Testimonials Section if populated.
  const __content = useContent();
  const __ts = __content?.testimonialsSection;
  const items =
    (__ts?.items && __ts.items.length > 0)
      ? __ts.items.map((it) => ({
          content: it.content,
          name: it.name,
          role: it.role ?? "",
          location: it.location ?? "",
          rating: it.rating,
        }))
      : t.testimonials.items;
  const __tsEyebrow  = __ts?.eyebrow  ?? t.testimonials.eyebrow;
  const __tsTitle    = __ts?.title    ?? t.testimonials.title;
  const __tsSubtitle = __ts?.subtitle ?? t.testimonials.subtitle;
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a === 0 ? items.length - 1 : a - 1));
  const next = () => setActive((a) => (a === items.length - 1 ? 0 : a + 1));

  return (
    <section className="bg-navy-950 noise-overlay section-py relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(30,72,184,0.15) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <SectionHeader
          eyebrow={__tsEyebrow}
          title={__tsTitle}
          subtitle={__tsSubtitle}
          theme="dark"
          className="mb-14"
        />

        {/* Featured testimonial */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl p-8 sm:p-10 text-center relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 left-8 text-gold-500/20">
                <Quote className="w-16 h-16 fill-current" />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-6">
                <StarRow count={items[active].rating} />

                <blockquote className="text-white text-lg sm:text-xl leading-relaxed font-medium italic max-w-2xl">
                  &ldquo;{items[active].content}&rdquo;
                </blockquote>

                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base mb-1"
                    style={{ background: "linear-gradient(135deg, #1E48B8, #3D62CC)" }}
                  >
                    {items[active].name.charAt(0)}
                  </div>
                  <p className="text-white font-semibold text-sm" style={{ fontFamily: "var(--font-jakarta)" }}>
                    {items[active].name}
                  </p>
                  <p className="text-white/45 text-xs">{items[active].role}</p>
                  <div className="flex items-center gap-1 text-white/35 text-xs">
                    <MapPin className="w-3 h-3" />
                    {items[active].location}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] hover:border-white/20 text-white/60 hover:text-white flex items-center justify-center transition-all duration-200 focus-ring"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    "transition-all duration-300 rounded-full focus-ring",
                    active === i
                      ? "w-6 h-2 bg-gold-400"
                      : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] hover:border-white/20 text-white/60 hover:text-white flex items-center justify-center transition-all duration-200 focus-ring"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mini cards */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {items.map(({ name, role, rating }, i) => (
            <button
              key={name}
              onClick={() => setActive(i)}
              className={cn(
                "p-4 rounded-xl text-left transition-all duration-300 focus-ring border",
                active === i
                  ? "bg-white/[0.1] border-white/20"
                  : "bg-transparent border-white/[0.06] hover:border-white/12 hover:bg-white/[0.04]"
              )}
            >
              <StarRow count={rating} />
              <p className="text-white text-xs font-semibold mt-2 leading-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
                {name}
              </p>
              <p className="text-white/35 text-[10px] mt-0.5">{role}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
