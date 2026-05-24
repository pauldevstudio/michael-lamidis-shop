"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

interface Props { images: ProductImage[]; alt: string; }

export function ProductGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const hero = images[active];

  if (!hero) {
    return (
      <div className="aspect-square w-full rounded-xl bg-bone-100 grid place-items-center text-sm text-ink-400">
        No image
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-bone-100 shadow-card">
        <Image
          src={hero.url}
          alt={hero.alt ?? alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <button
              key={img.url + idx}
              onClick={() => setActive(idx)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-bone-100",
                idx === active ? "border-ink-900 ring-2 ring-ink-900/20" : "border-ink-100"
              )}
            >
              <Image src={img.url} alt={img.alt ?? alt} fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
