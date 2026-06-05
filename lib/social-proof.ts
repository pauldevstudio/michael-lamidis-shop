// Deterministic, stable per-product social proof (rating, review count, units
// sold). Derived from the product id so the same product always shows the same
// numbers across cards and the detail page — no backend required, never shifts
// between renders.

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface SocialProof {
  rating: number;   // 4.6 – 5.0, one decimal
  reviews: number;  // 24 – 240
  sold: number;     // 30 – 500
}

export function productSocialProof(id: string): SocialProof {
  const h = hash(id || "default");
  const rating = +(4.6 + (h % 5) * 0.1).toFixed(1);
  const reviews = 24 + (h % 217);
  const sold = 30 + ((h >> 5) % 471);
  return { rating, reviews, sold };
}
