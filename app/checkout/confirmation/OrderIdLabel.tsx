"use client";

import { useSearchParams } from "next/navigation";

/**
 * Reads ?order=<id> from the URL and renders a compact reference label.
 * Lives in its own client component so the confirmation page itself can
 * stay a server component (good for SEO meta).
 */
export default function OrderIdLabel() {
  const params = useSearchParams();
  const orderId = params.get("order");
  if (!orderId) return null;
  return (
    <p className="inline-block mt-2 px-3 py-1 rounded-full bg-navy-50 border border-navy-100 text-navy-500 text-xs font-mono">
      Reference: {orderId}
    </p>
  );
}
