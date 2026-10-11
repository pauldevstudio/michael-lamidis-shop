/**
 * Order for product lists: in-stock products first, sold ones last. The order
 * inside each group is kept as given. No local imports (so `node --test` can
 * load this file directly).
 */

export function inStockFirst<T extends { sold?: boolean }>(products: readonly T[]): T[] {
  return [...products.filter((p) => !p.sold), ...products.filter((p) => p.sold)];
}
