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
    <section className="relative min-h-[45vh] flex items-end overflow-hidden pt-28 pb-16">
      <Image src="/hero-contact.webp" alt="" fill className="object-cover object-center" sizes="100vw" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(110deg, rgba(3,8,19,0.88) 0%, rgba(3,8,19,0.7) 40%, rgba(3,8,19,0.5) 100%)" }} />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.span
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-bold tracking-widest uppercase mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400" /> {__badge}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-white leading-tight tracking-tighter max-w-2xl"
          style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2.2rem, 5vw, 3.75rem)" }}
        >
          {__headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="text-white/50 text-lg leading-relaxed max-w-xl mt-4"
        >
          {__subheadline}
        </motion.p>
      </div>
    </section>
  );
}
