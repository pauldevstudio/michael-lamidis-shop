"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  phone: string; // e.g. "+357 25 123 456"
  message?: string;
}

export default function WhatsAppButton({
  phone,
  message = "Hello! I'm interested in your open box appliances.",
}: Props) {
  const [visible, setVisible]   = useState(false);
  const [tooltip, setTooltip]   = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show button after slight delay on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Show tooltip nudge after 5 s
  useEffect(() => {
    if (!visible || dismissed) return;
    const t = setTimeout(() => setTooltip(true), 5000);
    return () => clearTimeout(t);
  }, [visible, dismissed]);

  // Strip non-digits for the wa.me link (keep leading +)
  const digits = phone.replace(/[^\d+]/g, "");
  const encoded = encodeURIComponent(message);
  const href = `https://wa.me/${digits}?text=${encoded}`;

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && !dismissed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-start gap-2.5 max-w-[220px] rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-gray-100 px-4 py-3"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 leading-snug">
                Chat on WhatsApp
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                Get a quick answer about any product!
              </p>
            </div>
            <button
              onClick={() => { setTooltip(false); setDismissed(true); }}
              className="text-gray-300 hover:text-gray-500 mt-0.5 shrink-0 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="pointer-events-auto relative w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-shadow hover:shadow-[0_10px_32px_rgba(37,211,102,0.6)]"
        style={{ background: "#25D366" }}
        onClick={() => setTooltip(false)}
      >
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-7 h-7"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>

        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ background: "#25D366", animationDuration: "2s" }}
        />
      </motion.a>
    </div>
  );
}
