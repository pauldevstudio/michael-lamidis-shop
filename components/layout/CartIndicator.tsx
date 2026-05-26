"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

/**
 * Cart icon for the top nav. Shows a count badge when items are present.
 * Links to /cart.
 */
export default function CartIndicator({ className = "" }: { className?: string }) {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Cart (${totalItems} item${totalItems === 1 ? "" : "s"})`}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors ${className}`}
    >
      <ShoppingBag className="w-[18px] h-[18px]" />
      {totalItems > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gold-500 text-navy-950 text-[10px] font-black flex items-center justify-center shadow-md"
          aria-hidden="true"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
