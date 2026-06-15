"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, RotateCw, ZoomIn, ZoomOut, Crop as CropIcon, RefreshCw, Loader2 } from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────
   Self-contained canvas crop & resize. No external dependencies.

   The same `paint()` routine draws both the live preview and the final
   export, so what the user sees in the frame is exactly what gets saved
   (WYSIWYG). The image is panned/zoomed/rotated behind a fixed-aspect
   crop window; on Apply we render the visible region into a normalised
   output canvas and hand back a compressed WebP/JPEG File.
   ──────────────────────────────────────────────────────────────────────── */

const OUTPUT_LONG = 1280; // longest side of the saved image (px) — crisp + light
const MIN_ZOOM = 1;       // 1 = the image just covers the crop window
const MAX_ZOOM = 5;

type Ratio = { key: string; label: string; value: number | null };
const RATIOS: Ratio[] = [
  { key: "1:1", label: "Square", value: 1 },
  { key: "4:3", label: "4:3", value: 4 / 3 },
  { key: "3:4", label: "3:4", value: 3 / 4 },
  { key: "16:9", label: "16:9", value: 16 / 9 },
  { key: "orig", label: "Original", value: null },
];

const norm360 = (deg: number) => ((deg % 360) + 360) % 360;

/** Draw the transformed source into a `W×H` context (W/H must equal the aspect). */
function paint(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  img: CanvasImageSource,
  iw: number,
  ih: number,
  angleDeg: number,
  zoom: number,
  panX: number,
  panY: number,
) {
  const rot = norm360(angleDeg);
  const swap = rot === 90 || rot === 270;
  const ew = swap ? ih : iw; // effective (post-rotation) dims
  const eh = swap ? iw : ih;
  const coverScale = Math.max(W / ew, H / eh);
  const scale = coverScale * zoom;
  const ow = iw * scale;
  const oh = ih * scale;
  const cx = W / 2 + panX * W;
  const cy = H / 2 + panY * H;

  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rot * Math.PI) / 180);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, -ow / 2, -oh / 2, ow, oh);
  ctx.restore();
}

/** Keep the pan within bounds so the image always fully covers the frame. */
function clampPan(
  panX: number,
  panY: number,
  iw: number,
  ih: number,
  angleDeg: number,
  a: number,
  zoom: number,
) {
  const rot = norm360(angleDeg);
  const swap = rot === 90 || rot === 270;
  const ew = swap ? ih : iw;
  const eh = swap ? iw : ih;
  const Wr = 1;
  const Hr = 1 / a;
  const coverScale = Math.max(Wr / ew, Hr / eh);
  const scale = coverScale * zoom;
  const drawW = ew * scale;
  const drawH = eh * scale;
  const maxX = Math.max(0, (drawW - Wr) / 2) / Wr;
  const maxY = Math.max(0, (drawH - Hr) / 2) / Hr;
  return {
    x: Math.min(maxX, Math.max(-maxX, panX)),
    y: Math.min(maxY, Math.max(-maxY, panY)),
  };
}

/** Compute the saved output dimensions, never upscaling past the source. */
function outputDims(
  iw: number,
  ih: number,
  angleDeg: number,
  a: number,
  zoom: number,
) {
  const rot = norm360(angleDeg);
  const swap = rot === 90 || rot === 270;
  const ew = swap ? ih : iw;
  const eh = swap ? iw : ih;
  const cropEffSrcW = Math.min(ew, a * eh) / zoom; // native px the crop spans
  let outW: number;
  let outH: number;
  if (a >= 1) {
    outW = OUTPUT_LONG;
    outH = OUTPUT_LONG / a;
  } else {
    outH = OUTPUT_LONG;
    outW = OUTPUT_LONG * a;
  }
  if (outW > cropEffSrcW) {
    outW = cropEffSrcW;
    outH = cropEffSrcW / a;
  }
  return { w: Math.max(1, Math.round(outW)), h: Math.max(1, Math.round(outH)) };
}

interface Props {
  /** Source as a freshly-picked File (upload flow)… */
  file?: File | null;
  /** …or an existing image URL to re-crop. */
  src?: string;
  /** Base name used for the saved file. */
  fileName?: string;
  /** "1 of 3" badge when cropping a queue of uploads. */
  queueInfo?: { index: number; total: number };
  /** Show the "Use original" bypass (only meaningful when cropping a new File). */
  allowSkip?: boolean;
  onCancel: () => void;
  /** Receives the cropped+resized File (or the original on skip). */
  onComplete: (file: File) => void;
}

export default function ImageCropper({
  file,
  src,
  fileName,
  queueInfo,
  allowSkip,
  onCancel,
  onComplete,
}: Props) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const [ratioKey, setRatioKey] = useState("1:1");
  const [aspect, setAspect] = useState(1);
  const [angle, setAngle] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ active: boolean; px: number; py: number; ox: number; oy: number }>({
    active: false, px: 0, py: 0, ox: 0, oy: 0,
  });

  // ── Load the source image ────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";
    setReady(false);
    setError(null);
    const image = new Image();
    if (file) {
      objectUrl = URL.createObjectURL(file);
      image.src = objectUrl;
    } else if (src) {
      if (/^https?:/i.test(src)) image.crossOrigin = "anonymous";
      image.src = src;
    }
    image.onload = () => {
      if (cancelled) return;
      setImg(image);
      setDims({ w: image.naturalWidth, h: image.naturalHeight });
      setAngle(0);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRatioKey("1:1");
      setAspect(1);
      setReady(true);
    };
    image.onerror = () => {
      if (!cancelled) setError("Could not load this image.");
    };
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file, src]);

  // Preview frame size (CSS px) derived from the chosen aspect.
  const MAX_W = 460;
  const MAX_H = 360;
  let pw: number;
  let ph: number;
  if (aspect >= 1) {
    pw = Math.min(MAX_W, MAX_H * aspect);
    ph = pw / aspect;
  } else {
    ph = Math.min(MAX_H, MAX_W / aspect);
    pw = ph * aspect;
  }
  pw = Math.round(pw);
  ph = Math.round(ph);

  // ── Redraw the preview whenever anything changes ─────────────────────
  useEffect(() => {
    if (!ready || !img) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(pw * dpr);
    canvas.height = Math.round(ph * dpr);
    canvas.style.width = `${pw}px`;
    canvas.style.height = `${ph}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint(ctx, pw, ph, img, dims.w, dims.h, angle, zoom, pan.x, pan.y);
  }, [ready, img, dims, angle, zoom, pan, pw, ph]);

  const applyZoom = useCallback(
    (next: number) => {
      const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
      setZoom(z);
      setPan((p) => clampPan(p.x, p.y, dims.w, dims.h, angle, aspect, z));
    },
    [dims, angle, aspect],
  );

  // Wheel-to-zoom (non-passive so we can preventDefault the page scroll).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      applyZoom(zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1));
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [applyZoom, zoom]);

  // Escape closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    drag.current = { active: true, px: e.clientX, py: e.clientY, ox: pan.x, oy: pan.y };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current.active) return;
    const dx = (e.clientX - drag.current.px) / pw;
    const dy = (e.clientY - drag.current.py) / ph;
    const next = clampPan(drag.current.ox + dx, drag.current.oy + dy, dims.w, dims.h, angle, aspect, zoom);
    setPan(next);
  };
  const endDrag = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drag.current.active = false;
    try { (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };

  const chooseRatio = (r: Ratio) => {
    const rot = norm360(angle);
    const swap = rot === 90 || rot === 270;
    const ew = swap ? dims.h : dims.w;
    const eh = swap ? dims.w : dims.h;
    const a = r.value ?? (eh ? ew / eh : 1);
    setRatioKey(r.key);
    setAspect(a);
    setPan((p) => clampPan(p.x, p.y, dims.w, dims.h, angle, a, zoom));
  };

  const rotate = () => {
    const next = norm360(angle + 90);
    setAngle(next);
    setPan((p) => clampPan(p.x, p.y, dims.w, dims.h, next, aspect, zoom));
  };

  const reset = () => {
    setAngle(0);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const out = ready ? outputDims(dims.w, dims.h, angle, aspect, zoom) : { w: 0, h: 0 };

  const baseName = (fileName || file?.name || "product")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 50) || "product";

  const apply = async () => {
    if (!img) return;
    setExporting(true);
    try {
      const { w, h } = outputDims(dims.w, dims.h, angle, aspect, zoom);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no-2d");
      paint(ctx, w, h, img, dims.w, dims.h, angle, zoom, pan.x, pan.y);

      const toBlob = (type: string, q?: number) =>
        new Promise<Blob | null>((res) => canvas.toBlob(res, type, q));

      let blob = await toBlob("image/webp", 0.9);
      if (!blob) blob = await toBlob("image/jpeg", 0.92);
      if (!blob) throw new Error("encode");

      const ext = blob.type === "image/webp" ? "webp" : "jpg";
      const cropped = new File([blob], `${baseName}-cropped.${ext}`, { type: blob.type });
      onComplete(cropped);
    } catch {
      setError(
        "Could not process this image. It may be blocked by cross-origin rules — try re-uploading the original file.",
      );
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-xl border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <CropIcon className="w-4 h-4 text-gold-400" />
            <h2 className="text-slate-100 font-display font-bold text-base">Crop &amp; Resize</h2>
            {queueInfo && queueInfo.total > 1 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-semibold">
                {queueInfo.index + 1} of {queueInfo.total}
              </span>
            )}
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            aria-label="Close cropper"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Stage */}
          <div className="flex justify-center">
            <div
              className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-700"
              style={{ width: pw || 280, height: ph || 280 }}
            >
              {!ready && !error && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                  <p className="text-red-400 text-xs font-medium">{error}</p>
                </div>
              )}
              {ready && !error && (
                <>
                  <canvas
                    ref={canvasRef}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    className="touch-none cursor-grab active:cursor-grabbing select-none"
                  />
                  {/* Rule-of-thirds overlay (not exported) */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20" />
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/30 rounded-xl" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Aspect ratios */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {RATIOS.map((r) => (
              <button
                key={r.key}
                onClick={() => chooseRatio(r)}
                disabled={!ready}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors disabled:opacity-40 ${
                  ratioKey === r.key
                    ? "bg-gold-500 text-white border-gold-500"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Zoom + rotate */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => applyZoom(zoom / 1.1)}
              disabled={!ready}
              className="w-9 h-9 shrink-0 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-500 flex items-center justify-center disabled:opacity-40"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              value={zoom}
              disabled={!ready}
              onChange={(e) => applyZoom(Number(e.target.value))}
              className="flex-1 accent-gold-500"
              aria-label="Zoom"
            />
            <button
              onClick={() => applyZoom(zoom * 1.1)}
              disabled={!ready}
              className="w-9 h-9 shrink-0 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-500 flex items-center justify-center disabled:opacity-40"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={rotate}
              disabled={!ready}
              className="w-9 h-9 shrink-0 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-500 flex items-center justify-center disabled:opacity-40"
              aria-label="Rotate 90°"
              title="Rotate 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={reset}
              disabled={!ready}
              className="w-9 h-9 shrink-0 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-500 flex items-center justify-center disabled:opacity-40"
              aria-label="Reset"
              title="Reset"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-slate-500 text-[11px]">
            Drag to reposition · scroll or use the slider to zoom
            {ready && out.w > 0 && (
              <>
                {" · "}
                <span className="text-slate-400 font-semibold">Output {out.w}×{out.h}px</span>
              </>
            )}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800"
          >
            Cancel
          </button>
          {allowSkip && file && (
            <button
              onClick={() => onComplete(file)}
              disabled={exporting}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
            >
              Use original
            </button>
          )}
          <button
            onClick={apply}
            disabled={!ready || exporting || !!error}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #3A5F8A, #5B82A8)" }}
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CropIcon className="w-4 h-4" />}
            {exporting ? "Processing…" : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}
