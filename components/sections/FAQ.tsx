"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";
import SectionHeader from "@/components/shared/SectionHeader";
import { cn } from "@/lib/utils";

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      className={cn(
        "border rounded-2xl overflow-hidden transition-all duration-300",
        isOpen
          ? "border-navy-200 shadow-md"
          : "border-navy-100/60 hover:border-navy-200"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-6 text-left focus-ring"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <span className={cn(
            "text-xs font-bold tabular-nums min-w-[1.5rem]",
            isOpen ? "text-navy-500" : "text-navy-200"
          )}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={cn(
              "font-semibold text-sm sm:text-base leading-snug transition-colors duration-200",
              isOpen ? "text-navy-950" : "text-navy-700"
            )}
            style={{ fontFamily: "var(--font-jakarta)" }}
          >
            {question}
          </span>
        </div>

        <div
          className={cn(
            "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
            isOpen
              ? "bg-navy-950 text-white"
              : "bg-navy-50 text-navy-400 group-hover:bg-navy-100"
          )}
        >
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 pb-6 pl-6 sm:pl-[4.5rem]">
              <p className="text-navy-900/55 text-sm leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const { t } = useLanguage();
  const __content = useContent();
  const __f = __content?.faq;
  const __cms = {
    eyebrow:  __f?.eyebrow  ?? t.faq.eyebrow,
    title:    __f?.title    ?? t.faq.title,
    subtitle: __f?.subtitle ?? t.faq.subtitle,
    items:    (__f?.items && __f.items.length > 0) ? __f.items : t.faq.items,
  };
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="bg-white section-py">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-start">
          {/* Left — header + CTA */}
          <div className="flex flex-col gap-8 lg:sticky lg:top-28">
            <SectionHeader
              eyebrow={__cms.eyebrow}
              title={__cms.title}
              subtitle={__cms.subtitle}
              theme="light"
              align="left"
            />

            {/* CTA card */}
            <div className="relative rounded-2xl p-7 overflow-hidden"
              style={{ background: "linear-gradient(135deg, #030813 0%, #091F52 100%)" }}
            >
              <div className="absolute inset-0 dot-grid-bg opacity-40" />
              <div className="relative z-10 flex flex-col gap-4">
                <p className="text-white/60 text-sm">{t.faq.cta}</p>
                <h3 className="text-white font-display font-bold text-xl" style={{ fontFamily: "var(--font-jakarta)" }}>
                  Our team answers within 2 hours.
                </h3>
                <Link href="/contact" className="btn-gold text-sm w-fit">
                  {t.faq.ctaBtn}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right — accordion */}
          <div className="flex flex-col gap-3">
            {__cms.items.map(({ question, answer }, i) => (
              <FAQItem
                key={i}
                question={question}
                answer={answer}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
