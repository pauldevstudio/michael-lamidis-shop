"use client";

import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="relative min-h-[45vh] flex items-end bg-navy-950 noise-overlay overflow-hidden pt-28 pb-16">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 40% 60%, rgba(200,136,26,0.18) 0%, transparent 60%)" }}
      />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.span
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-bold tracking-widest uppercase mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400" /> Contact
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-white leading-tight tracking-tighter max-w-2xl"
          style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(2.2rem, 5vw, 3.75rem)" }}
        >
          We&apos;re Here to{" "}
          <span className="text-gradient-gold">Help You Save</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="text-white/50 text-lg leading-relaxed max-w-xl mt-4"
        >
          Visit our Limassol showroom or contact us online. Our specialists respond within 2 hours.
        </motion.p>
      </div>
    </section>
  );
}
