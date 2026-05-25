"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n-context";

export default function FAQHero() {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[42vh] flex items-end bg-navy-950 noise-overlay overflow-hidden pt-28 pb-14">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(30,72,184,0.2) 0%, transparent 60%)" }}
      />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.span
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-bold tracking-widest uppercase mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400" /> {t.pages.faq.badge}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-white leading-tight tracking-tighter max-w-2xl"
          style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2.2rem, 5vw, 3.75rem)" }}
        >
          {t.pages.faq.titleLine1}{" "}
          <span className="text-gradient-gold">{t.pages.faq.titleLine2}</span>
        </motion.h1>
      </div>
    </section>
  );
}
