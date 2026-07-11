"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, Play } from "lucide-react";

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => setMounted(true), []);

  const stableClose = useCallback(() => {
    onClose();
    if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { stableClose(); return; }
      if (e.key !== "Tab") return;
      const container = dialogRef.current;
      if (!container) return;
      const focusable = container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, stableClose]);

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

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

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
          ref={dialogRef}
          onClick={stableClose}
          role="dialog"
          aria-modal="true"
          aria-label="Showroom video"
        >
          <motion.div
            className="relative max-h-[88vh] max-w-[92vw] overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/15"
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              src={src}
              className="block h-auto max-h-[88vh] w-auto max-w-[92vw] cursor-pointer"
              autoPlay
              loop
              playsInline
              muted
              preload="auto"
              onClick={togglePlay}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />

            {/* Center play button — shown whenever paused (e.g. if autoplay is blocked) */}
            {!playing && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/35 focus-ring"
                aria-label="Play video"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg">
                  <Play className="ml-0.5 h-7 w-7 text-navy-950" fill="currentColor" />
                </span>
              </button>
            )}

            {/* Controls */}
            <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
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
