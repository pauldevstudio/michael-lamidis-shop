"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Heart, Leaf, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { KITCHEN_IMAGE } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";
import SectionHeader from "@/components/shared/SectionHeader";
import { StaggerChildren, StaggerItem } from "@/components/shared/AnimatedSection";
import AnimatedSection from "@/components/shared/AnimatedSection";

const VALUE_ICONS = [CheckCircle, Star, Heart, Leaf];

export default function AboutContent() {
  const { t, pick } = useLanguage();
  const __content = useContent();
  const __about = __content?.about;
  const __headline    = pick(__about?.headline,    t.pages.about.defaultHeadline) ?? t.pages.about.defaultHeadline;
  const __subheadline = pick(__about?.subheadline, t.pages.about.defaultSubheadline) ?? t.pages.about.defaultSubheadline;
  const __cmsStory = (__about?.story && __about.story.length > 0) ? __about.story : undefined;
  const __story = pick(__cmsStory, t.pages.about.defaultStory) ?? t.pages.about.defaultStory;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden pt-28 pb-20">
        <Image src="/hero-about.png" alt="" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(110deg, rgba(3,8,19,0.88) 0%, rgba(3,8,19,0.7) 40%, rgba(3,8,19,0.5) 100%)" }} />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-bold tracking-widest uppercase mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            {t.pages.about.badge}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-white leading-[1.05] tracking-tighter max-w-4xl"
            style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            {__headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/50 text-lg leading-relaxed max-w-2xl mt-5"
          >
            {__subheadline}
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white section-py">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
            <AnimatedSection>
              <div className="relative">
                {/* Real kitchen photo */}
                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden relative shadow-[0_24px_64px_rgba(3,8,19,0.18)]">
                  <Image
                    src={KITCHEN_IMAGE}
                    alt="Premium modern kitchen showroom with stainless steel appliances — Michael Lamidis Limassol"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Subtle dark overlay for stat cards */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                </div>

                {/* Stats overlay */}
                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3">
                  {[
                    { value: "12+", label: t.pages.about.statYears },
                    { value: "5K+", label: t.pages.about.statCustomers },
                    { value: "50+", label: t.pages.about.statBrands },
                  ].map(({ value, label }) => (
                    <div key={label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.18)" }}>
                      <p className="text-white font-black text-xl" style={{ fontFamily: "var(--font-jakarta)" }}>{value}</p>
                      <p className="text-white/60 text-[11px] font-medium">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="left" delay={0.1}>
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-navy-500 flex items-center gap-2 mb-4">
                    <span className="w-5 h-px bg-navy-500" /> {t.pages.about.whoWeAre} <span className="w-5 h-px bg-navy-500" />
                  </span>
                  <h2 className="font-display font-bold text-navy-950 text-3xl leading-tight tracking-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
                    {t.pages.about.whoTitle}
                  </h2>
                </div>
                {__story.map((paragraph, i) => (
                  <p key={i} className="text-navy-900/55 text-base leading-relaxed">{paragraph}</p>
                ))}
                <Link href="/contact" className="btn-primary text-sm w-fit mt-2">
                  {t.pages.about.getInTouch} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-py" style={{ background: "#F8FAFF" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <SectionHeader
            eyebrow={t.pages.about.valuesEyebrow}
            title={t.pages.about.valuesTitle}
            theme="light"
            className="mb-12"
          />
          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.pages.about.values.map((v, idx) => {
              const Icon = VALUE_ICONS[idx % VALUE_ICONS.length];
              const { title, desc } = v;
              return (
              <StaggerItem key={title}>
                <div className="flex flex-col gap-4 p-7 rounded-2xl bg-white border border-navy-100/60 hover:border-navy-200 hover:shadow-card-lift transition-all duration-400 cursor-default h-full">
                  <div className="w-11 h-11 rounded-xl bg-navy-950 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-navy-950 font-semibold text-base" style={{ fontFamily: "var(--font-jakarta)" }}>{title}</h3>
                    <p className="text-navy-900/50 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white section-py">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <SectionHeader
            eyebrow={t.pages.about.teamEyebrow}
            title={t.pages.about.teamTitle}
            theme="light"
            className="mb-12"
          />
          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.pages.about.team.map((member, idx) => {
              const colors = ["#1E48B8", "#0F766E", "#7C3AED", "#C8881A"];
              const color = colors[idx % colors.length];
              const initial = member.name.charAt(0);
              const { name, role } = member;
              return (
              <StaggerItem key={name}>
                <div className="flex flex-col items-center gap-4 p-7 rounded-2xl border border-navy-100/60 bg-gradient-to-b from-navy-50/40 to-white text-center hover:shadow-card-lift transition-all duration-400">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
                  >
                    {initial}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-navy-950 font-semibold text-base" style={{ fontFamily: "var(--font-jakarta)" }}>{name}</p>
                    <p className="text-navy-400 text-sm">{role}</p>
                  </div>
                </div>
              </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="section-py bg-navy-950 noise-overlay relative overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <AnimatedSection>
            <h2 className="text-white font-display font-black text-3xl sm:text-4xl mb-4" style={{ fontFamily: "var(--font-jakarta)" }}>
              {t.pages.about.ctaTitle}
            </h2>
            <p className="text-white/50 text-base mb-8 max-w-lg mx-auto">
              {t.pages.about.ctaSubtitle}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/products" className="btn-gold text-sm">{t.pages.about.ctaBrowse} <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
