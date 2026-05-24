import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

interface Props { products: Product[]; }

export function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink-200 bg-bone py-20 text-center">
        <p className="font-heading text-base font-medium text-ink-700">
          No products match these filters.
        </p>
        <p className="mt-1 text-sm text-ink-500">Try widening your search.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
