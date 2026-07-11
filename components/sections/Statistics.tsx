"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";
import SectionHeader from "@/components/shared/SectionHeader";

function Counter({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Statistics() {
  const { t, lang, pick } = useLanguage();
  // CMS overlay: prefer Payload Stats Section if populated.
  const __content = useContent();
  const __ss = __content?.statsSection;
  const __statsItems =
    (lang === "en" && __ss?.items && __ss.items.length > 0)
      ? __ss.items.map((it) => ({ value: it.value, suffix: it.suffix, label: it.label }))
      : (t.stats.items as Array<{ value: number; suffix: string; label: string }>);
  const __statsEyebrow = pick(__ss?.eyebrow, t.stats.eyebrow);
  const __statsTitle   = pick(__ss?.title,   t.stats.title);

  return (
    <section className="section-py relative overflow-hidden" style={{ background: "#030813" }}>
      {/* Background */}
      <div className="absolute inset-0 dot-grid-bg opacity-60" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(30,72,184,0.2) 0%, transparent 60%)" }}
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(200,136,26,0.12) 0%, transparent 60%)" }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <SectionHeader
          eyebrow={__statsEyebrow}
          title={__statsTitle}
          theme="dark"
          className="mb-16"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {__statsItems.map(({ value, suffix, label }, i) => (
            <div
              key={label}
              className="group relative flex flex-col items-center gap-3 p-5 sm:p-7 lg:p-8 rounded-2xl glass-card hover:border-white/20 transition-all duration-400 cursor-default text-center"
            >
              {/* Subtle number glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(200,136,26,0.06), transparent)" }}
              />

              <div
                className="relative font-display font-black text-3xl sm:text-5xl lg:text-6xl leading-none text-gradient-gold"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                <Counter target={value} suffix={suffix} duration={1800 + i * 200} />
              </div>

              <div className="h-px w-8 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

              <p className="text-white/50 text-sm font-medium leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Bottom cta */}
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="text-white/40 text-sm">
            Join thousands of Cypriot families who save with Lamidis every month.
          </p>
          <div className="flex items-center gap-3">
            <a href="/products" className="btn-gold text-sm">Browse Products</a>
          </div>
        </div>
      </div>
    </section>
  );
}
