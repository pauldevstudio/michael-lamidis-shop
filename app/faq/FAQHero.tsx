"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n-context";

export default function FAQHero() {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[40vh] flex items-end bg-navy-900 overflow-hidden pt-28 pb-14">
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 90%, rgba(59,130,246,0.06) 0%, transparent 55%)" }}
      />
      <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl">
        <motion.span
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm text-white/75 text-[11px] font-medium tracking-[0.12em] uppercase mb-7"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/50" /> {t.pages.faq.badge}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-white leading-[1.06] tracking-[-0.025em] max-w-2xl"
          style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
        >
          {t.pages.faq.titleLine1}{" "}
          <span className="text-blue-400">{t.pages.faq.titleLine2}</span>
        </motion.h1>
      </div>
    </section>
  );
}
