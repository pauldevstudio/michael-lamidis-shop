import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, discountPercent } from "@/lib/utils";
import type { Product } from "@/types";

interface Props { product: Product; }

export function ProductCard({ product }: Props) {
  const cover = product.images[0]?.url;
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-ink-100 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-ink-200"
    >
      <div className="relative aspect-square bg-bone-100">
        {cover ? (
          <Image
            src={cover}
            alt={product.images[0]?.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-ink-300 text-sm">No image</div>
        )}
        {discount && (
          <span className="absolute left-3 top-3 rounded-full bg-ink-900 px-2.5 py-1 text-xs font-semibold text-bone">
            −{discount}%
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.12em] text-ink-500">{product.brand}</p>
        <h3 className="mt-1.5 line-clamp-2 font-heading text-base font-semibold text-ink-900 group-hover:text-gold-600 transition-colors">
          {product.name}
        </h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-heading text-lg font-bold text-ink-900">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-ink-400 line-through">
              {formatPrice(product.originalPrice, product.currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
