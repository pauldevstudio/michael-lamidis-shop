"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CartContent() {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);

  // Avoid SSR/hydration mismatch — cart is localStorage-backed.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="h-72 rounded-2xl bg-navy-50 animate-pulse" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center py-12">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-navy-50 items-center justify-center mb-6">
          <ShoppingBag className="w-7 h-7 text-navy-300" />
        </div>
        <h1 className="font-display font-black text-3xl text-navy-950 mb-3">
          Your cart is empty
        </h1>
        <p className="text-navy-400 mb-8 leading-relaxed">
          Browse our certified open box appliances and add anything you like.
        </p>
        <Link href="/products" className="btn-gold text-sm">
          Browse Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-navy-400 hover:text-navy-700 text-sm font-medium transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue shopping
        </Link>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-navy-950">
          Your Cart
        </h1>
        <p className="text-navy-400 mt-1 text-sm">
          {totalItems} item{totalItems === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white border border-navy-100 rounded-2xl p-4 flex items-center gap-4"
            >
              {/* Image */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-navy-50 shrink-0">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={`${product.brand} ${product.model}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})` }}
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-navy-400 text-[10px] font-bold uppercase tracking-widest">
                  {product.brand}
                </p>
                <Link
                  href={`/products/${product.id}`}
                  className="text-navy-950 font-semibold text-sm hover:text-gold-500 transition-colors truncate block"
                >
                  {product.model}
                </Link>
                <p className="text-navy-400 text-xs mt-1 capitalize">
                  {product.category.replace("-", " ")} · Grade {product.grade}
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  aria-label="Decrease quantity"
                  className="w-8 h-8 rounded-lg border border-navy-200 text-navy-500 hover:bg-navy-50 transition flex items-center justify-center"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-navy-950 font-semibold text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  aria-label="Increase quantity"
                  className="w-8 h-8 rounded-lg border border-navy-200 text-navy-500 hover:bg-navy-50 transition flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Price + remove */}
              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0 w-28">
                <p className="text-navy-950 font-black text-base">
                  {formatPrice(product.salePrice * quantity)}
                </p>
                <button
                  onClick={() => removeFromCart(product.id)}
                  aria-label="Remove from cart"
                  className="text-navy-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 h-fit bg-navy-50/60 border border-navy-100 rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-navy-950 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-navy-500">
              <span>Subtotal ({totalItems} item{totalItems === 1 ? "" : "s"})</span>
              <span className="text-navy-950 font-semibold">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-navy-500">
              <span>Delivery</span>
              <span className="text-emerald-600 font-semibold">Free</span>
            </div>
          </div>
          <div className="border-t border-navy-200 mt-4 pt-4 flex justify-between items-baseline">
            <span className="text-navy-950 font-bold">Total</span>
            <span className="text-navy-950 font-black text-2xl" style={{ fontFamily: "var(--font-jakarta)" }}>
              {formatPrice(totalPrice)}
            </span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 btn-gold w-full justify-center text-sm"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-navy-400 text-xs mt-4 text-center leading-relaxed">
            Choose how to pay (bank transfer, cash on delivery, or pickup) on the next step.
          </p>
        </aside>
      </div>
    </div>
  );
}
