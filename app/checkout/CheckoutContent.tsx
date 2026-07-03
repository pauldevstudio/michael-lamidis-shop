"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Loader2, CreditCard, Banknote, Store, ShoppingBag,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

type PaymentMethod = "bank_transfer" | "cash_on_delivery" | "showroom_pickup";

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; desc: string; icon: typeof CreditCard }[] = [
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    desc: "Transfer to our account; we ship once funds clear.",
    icon: CreditCard,
  },
  {
    id: "cash_on_delivery",
    label: "Cash on Delivery",
    desc: "Pay when the appliance arrives at your door.",
    icon: Banknote,
  },
  {
    id: "showroom_pickup",
    label: "Pickup at Showroom",
    desc: "Pay in-store at Alassa Village, Limassol.",
    icon: Store,
  },
];

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  fullName: "", email: "", phone: "", address: "", city: "", postalCode: "", notes: "",
};

export default function CheckoutContent() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [payment, setPayment] = useState<PaymentMethod>("bank_transfer");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

  // If the cart empties (e.g., browser tab restored), bounce back to /cart.
  useEffect(() => {
    if (mounted && items.length === 0 && !submitting) {
      router.replace("/cart");
    }
  }, [mounted, items.length, submitting, router]);

  const update = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const requiredFilled =
    form.fullName.trim() && form.email.trim() && form.phone.trim() &&
    (payment === "showroom_pickup" || (form.address.trim() && form.city.trim()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requiredFilled || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          payment,
          items: items.map((i) => ({
            productId: i.product.id,
            brand: i.product.brand,
            model: i.product.model,
            salePrice: i.product.salePrice,
            quantity: i.quantity,
          })),
          totalPrice,
        }),
      });
      const data = (await res.json()) as { orderId?: string; error?: string };
      if (!res.ok || !data.orderId) {
        setError(data.error ?? "Failed to place order");
        setSubmitting(false);
        return;
      }
      // Meta Pixel Purchase conversion — fire BEFORE clearCart() so the cart
      // values are still populated. Only fires if marketing consent already
      // loaded fbq (guarded); see components/shared/MetaPixel.tsx.
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Purchase", {
          value: Number(totalPrice),
          currency: "EUR",
          content_type: "product",
          content_ids: items.map((i) => i.product.id),
          num_items: totalItems,
        });
      }
      clearCart();
      router.replace(`/checkout/confirmation?order=${data.orderId}`);
    } catch {
      setError("Network error — please try again");
      setSubmitting(false);
    }
  };

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
          href="/cart"
          className="inline-flex items-center gap-2 text-navy-400 hover:text-navy-700 text-sm font-medium transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to cart
        </Link>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-navy-950">
          Checkout
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <section className="bg-white border border-navy-100 rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg text-navy-950 mb-4">Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" required>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  autoComplete="name"
                  className="form-input-light text-sm"
                />
              </Field>
              <Field label="Phone" required>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  autoComplete="tel"
                  className="form-input-light text-sm"
                />
              </Field>
              <Field label="Email" required className="sm:col-span-2">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  autoComplete="email"
                  className="form-input-light text-sm"
                />
              </Field>
            </div>
          </section>

          {/* Delivery address (hidden when showroom pickup) */}
          {payment !== "showroom_pickup" && (
            <section className="bg-white border border-navy-100 rounded-2xl p-6">
              <h2 className="font-display font-bold text-lg text-navy-950 mb-4">Delivery Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Street address" required className="sm:col-span-2">
                  <input
                    required
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    autoComplete="street-address"
                    className="form-input-light text-sm"
                  />
                </Field>
                <Field label="City" required>
                  <input
                    required
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    autoComplete="address-level2"
                    className="form-input-light text-sm"
                  />
                </Field>
                <Field label="Postal code">
                  <input
                    value={form.postalCode}
                    onChange={(e) => update("postalCode", e.target.value)}
                    autoComplete="postal-code"
                    className="form-input-light text-sm"
                  />
                </Field>
                <Field label="Delivery notes (optional)" className="sm:col-span-2">
                  <textarea
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    rows={3}
                    placeholder="Gate code, preferred time of day, anything we should know…"
                    className="form-input text-sm resize-none"
                  />
                </Field>
              </div>
            </section>
          )}

          {/* Payment */}
          <section className="bg-white border border-navy-100 rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg text-navy-950 mb-4">Payment Method</h2>
            <div className="space-y-3">
              {PAYMENT_OPTIONS.map(({ id, label, desc, icon: Icon }) => {
                const active = payment === id;
                return (
                  <label
                    key={id}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                      active
                        ? "border-gold-400 bg-gold-50/60 ring-2 ring-gold-200"
                        : "border-navy-100 hover:border-navy-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={active}
                      onChange={() => setPayment(id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        active ? "bg-gold-500 text-navy-950" : "bg-navy-50 text-navy-500"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-navy-950 font-semibold text-sm">{label}</p>
                      <p className="text-navy-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        active ? "border-gold-500" : "border-navy-200"
                      }`}
                    >
                      {active && <span className="w-2.5 h-2.5 rounded-full bg-gold-500" />}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-24 h-fit bg-navy-50/60 border border-navy-100 rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-navy-950 mb-4">Order Summary</h2>
          <ul className="divide-y divide-navy-100 mb-4">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="py-3 flex items-start gap-3 text-sm">
                <span className="text-navy-300 text-xs font-bold w-6 text-right">×{quantity}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-navy-950 font-semibold truncate">{product.brand} {product.model}</p>
                  <p className="text-navy-400 text-xs capitalize">{product.category.replace("-", " ")}</p>
                </div>
                <span className="text-navy-700 font-semibold whitespace-nowrap">
                  {formatPrice(product.salePrice * quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-navy-500">
              <span>Subtotal</span>
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

          {error && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!requiredFilled || submitting}
            className="mt-6 btn-gold w-full justify-center text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Placing order…
              </>
            ) : (
              <>
                Place Order
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-navy-400 text-xs mt-4 text-center leading-relaxed">
            By placing this order you agree to our terms. We&apos;ll contact you within 2 hours to confirm.
          </p>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label, required, children, className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-navy-500 text-[11px] font-semibold uppercase tracking-wider">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
