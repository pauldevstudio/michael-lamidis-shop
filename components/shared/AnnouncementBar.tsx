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
  const { t } = useLanguage();
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
    ?? __ann?.message
    ?? t?.announcement?.message
    ?? "Summer Sale: Up to 70% off premium open box appliances. Limited stock.";
  const resolvedCta =
    ctaLabel
    ?? __ann?.ctaLabel
    ?? t?.announcement?.cta
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
          <div className="flex items-center justify-center gap-3 px-4 py-2.5 relative">
            <Tag className="w-3.5 h-3.5 text-white/70 shrink-0 hidden sm:block" />
            <p className="text-white text-xs sm:text-sm font-medium text-center leading-snug">
              {resolvedMessage}
            </p>
            {resolvedCta && (
              <Link
                href={resolvedCtaHref}
                className="shrink-0 ml-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] sm:text-xs font-bold transition-colors border border-white/30 whitespace-nowrap"
              >
                {resolvedCta} &rarr;
              </Link>
            )}
            <button
              onClick={() => setVisible(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
