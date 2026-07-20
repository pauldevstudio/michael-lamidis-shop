"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useContent } from "@/lib/content-context";
import { useLanguage } from "@/lib/i18n-context";

export default function ContactHero() {
  const { t, pick } = useLanguage();
  const __content = useContent();
  const __c = __content?.contact;
  const __badge       = pick(__c?.badge,       t.pages.contact.defaultBadge)       ?? t.pages.contact.defaultBadge;
  const __headline    = pick(__c?.headline,    t.pages.contact.defaultHeadline)    ?? t.pages.contact.defaultHeadline;
  const __subheadline = pick(__c?.subheadline, t.pages.contact.defaultSubheadline) ?? t.pages.contact.defaultSubheadline;

  return (
    <section className="relative min-h-[44vh] flex items-end overflow-hidden pt-28 pb-16">
      <Image src="/hero-contact.webp" alt="" fill className="object-cover object-center" sizes="100vw" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(3,8,19,0.76) 0%, rgba(3,8,19,0.46) 42%, rgba(3,8,19,0.14) 100%)" }} />
      <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl">
        <motion.span
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm text-white/75 text-[11px] font-medium tracking-[0.12em] uppercase mb-7"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/50" /> {__badge}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-white leading-[1.06] tracking-[-0.025em] max-w-2xl"
          style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
        >
          {__headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14 }}
          className="text-white/55 text-[0.95rem] sm:text-[1.05rem] leading-[1.7] max-w-[480px] mt-5"
        >
          {__subheadline}
        </motion.p>
      </div>
    </section>
  );
}
