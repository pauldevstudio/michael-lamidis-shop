"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";

interface Props {
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function AnnouncementBar({ message, ctaLabel, ctaHref = "/products" }: Props) {
  const { t, pick } = useLanguage();
  const [visible, setVisible] = useState(true);
  // framer-motion's <AnimatePresence initial={...}> emits inline styles on
  // mount that differ from the SSR HTML and trip React's hydration check.
  // Defer mounting until the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // CMS overlay: prefer Payload Announcement Bar if populated.
  // (Hooks must run unconditionally — placed before any early return.)
  const __content = useContent();
  const __ann = __content?.announcement;

  if (!mounted) return null;
  if (__ann && __ann.enabled === false) return null;

  const resolvedMessage =
    message
    ?? pick(__ann?.message, t?.announcement?.message)
    ?? "Summer Sale: Up to 70% off premium open box appliances. Limited stock.";
  const resolvedCta =
    ctaLabel
    ?? pick(__ann?.ctaLabel, t?.announcement?.cta)
    ?? "Shop Now";
  const resolvedCtaHref = ctaHref ?? __ann?.ctaHref ?? "/products";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
          style={{ background: "linear-gradient(90deg, #1E48B8 0%, #3D62CC 50%, #1E48B8 100%)" }}
        >
          <div className="ann-bar relative flex items-center h-9 sm:h-10 overflow-hidden">
            <style jsx>{`
              @keyframes ann-marquee {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
              }
              .ann-track { animation: ann-marquee 63s linear infinite; }
              .ann-bar:hover .ann-track { animation-play-state: paused; }
              @media (prefers-reduced-motion: reduce) {
                .ann-track { animation: none; }
              }
            `}</style>

            {/* One clean copy for screen readers (the visual ticker is decorative) */}
            <Link href={resolvedCtaHref} className="sr-only">
              {resolvedMessage} {resolvedCta}
            </Link>

            {/* Scrolling ticker — duplicated for a seamless, gap-free loop */}
            <div aria-hidden className="ann-track flex items-center whitespace-nowrap will-change-transform">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex items-center shrink-0">
                  {[0, 1, 2, 3, 4].map((k) => (
                    <Link
                      key={k}
                      href={resolvedCtaHref}
                      className="flex items-center gap-2.5 px-7 sm:px-12 text-white text-xs sm:text-sm font-medium tracking-wide"
                    >
                      <Tag className="w-3.5 h-3.5 text-white/70 shrink-0" />
                      <span>{resolvedMessage}</span>
                      {resolvedCta && (
                        <span className="font-bold underline underline-offset-2 decoration-white/40">
                          {resolvedCta} &rarr;
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              ))}
            </div>

            {/* Right-edge fade so the ticker slides out cleanly behind the dismiss button */}
            <div
              className="absolute right-0 inset-y-0 flex items-center pl-12 pr-1"
              style={{ background: "linear-gradient(to left, #1E48B8 60%, transparent)" }}
            >
              <button
                onClick={() => setVisible(false)}
                className="p-2 text-white/60 hover:text-white transition-colors"
                aria-label="Dismiss announcement"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
