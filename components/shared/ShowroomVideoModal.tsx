"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX } from "lucide-react";

/**
 * Fullscreen showroom video modal.
 * Autoplays muted (browser autoplay policy), loops, and exposes a
 * music mute/unmute toggle + close. Portals to <body> so it escapes the
 * hero's transformed/stacking context. Closes on backdrop click + Esc.
 */
export default function ShowroomVideoModal({
  open,
  onClose,
  src,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Esc to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // Play from the start (muted) on open; pause + reset on close.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (open) {
      setMuted(true);
      v.muted = true;
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [open]);

  // Mirror mute state onto the element (React's muted prop is unreliable).
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Showroom video"
        >
          <motion.div
            className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/15"
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              src={src}
              className="h-full w-full object-cover"
              autoPlay
              loop
              playsInline
              muted
              preload="auto"
            />

            {/* Controls */}
            <div className="absolute right-3 top-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                className="flex items-center gap-1.5 rounded-full bg-black/55 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-black/75 focus-ring"
                aria-label={muted ? "Unmute video" : "Mute video"}
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                {muted ? "Unmute" : "Mute"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/75 focus-ring"
                aria-label="Close video"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
