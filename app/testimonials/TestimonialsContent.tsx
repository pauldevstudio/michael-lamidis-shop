"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import Statistics from "@/components/sections/Statistics";
import LeadCapture from "@/components/sections/LeadCapture";

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
      ))}
    </div>
  );
}

export default function TestimonialsContent() {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden pt-28 pb-16">
        <Image src="/hero-testimonials.webp" alt="" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(110deg, rgba(3,8,19,0.88) 0%, rgba(3,8,19,0.7) 40%, rgba(3,8,19,0.5) 100%)" }} />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-bold tracking-widest uppercase mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" /> {t.pages.testimonials.badge}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-white leading-tight tracking-tighter max-w-3xl"
            style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2.2rem, 5vw, 3.75rem)" }}
          >
            {t.pages.testimonials.titleLine1}{" "}
            <span className="text-gradient-gold">{t.pages.testimonials.titleLine2}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="text-white/50 text-lg leading-relaxed max-w-xl mt-4"
          >
            {t.pages.testimonials.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="bg-white section-py">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.testimonials.items.map(({ name, role, location, content, rating }) => (
              <StaggerItem key={name}>
                <div className="testimonial-card relative overflow-hidden flex flex-col gap-5 h-full">
                  {/* Quote mark */}
                  <div className="absolute top-4 right-5 text-gold-500/10">
                    <Quote className="w-12 h-12 fill-current" />
                  </div>

                  <StarRow count={rating} />

                  <blockquote className="text-navy-900/70 text-sm leading-relaxed flex-1 italic">
                    &ldquo;{content}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-3 pt-3 border-t border-navy-100/60">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                      style={{ background: "linear-gradient(135deg, #1E48B8, #3D62CC)" }}
                    >
                      {name.charAt(0)}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-navy-950 font-semibold text-sm" style={{ fontFamily: "var(--font-jakarta)" }}>{name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-navy-400 text-xs">{role}</p>
                        <span className="text-navy-200">·</span>
                        <div className="flex items-center gap-1 text-navy-400 text-xs">
                          <MapPin className="w-3 h-3" />
                          {location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* CTA */}
          <div className="mt-14 text-center flex flex-col items-center gap-4">
            <p className="text-navy-900/50 text-sm">{t.pages.testimonials.ctaText}</p>
            <Link href="/products" className="btn-primary text-sm">
              {t.pages.testimonials.ctaBtn} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Statistics />
      <LeadCapture />
    </>
  );
}
