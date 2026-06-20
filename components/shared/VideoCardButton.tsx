"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";

/**
 * Play button + video lightbox for product cards.
 *
 * Renders nothing unless the product has a videoUrl, so cards without a video
 * are completely unchanged. The play control's hit area is only the circle —
 * the rest of the image keeps its card-navigation click. It's a role="button"
 * span so it can live inside the card's <a> without nesting interactive
 * elements. The modal is portaled to <body> so it escapes the card's
 * transformed / overflow-hidden ancestors and covers the full viewport.
 */
export default function VideoCardButton({
  videoUrl,
  title,
}: {
  videoUrl?: string | null;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!videoUrl) return null;

  const play = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      {/* Click-through wrapper (pointer-events-none) so only the circle opens
          the video; the rest of the image keeps its card-navigation click. */}
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <span
          role="button"
          tabIndex={0}
          aria-label={title ? `Play video: ${title}` : "Play product video"}
          onClick={play}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") play(e);
          }}
          className="pointer-events-auto cursor-pointer w-12 h-12 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-lg ring-1 ring-black/10 transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Play className="w-5 h-5 text-navy-900 fill-navy-900 translate-x-[1px]" />
        </span>
      </div>

      {open &&
        mounted &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Product video"
            className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              aria-label="Close video"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={videoUrl}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl bg-black"
            />
          </div>,
          document.body,
        )}
    </>
  );
}
