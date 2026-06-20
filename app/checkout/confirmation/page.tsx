import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import OrderIdLabel from "./OrderIdLabel";

export const metadata: Metadata = {
  title: "Order Confirmed — Michael Lamidis",
  description: "Thanks for your order. We'll contact you within 2 hours to confirm details.",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="pt-24 pb-16 bg-white min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center py-12">
          <div className="inline-flex w-20 h-20 rounded-full bg-emerald-50 items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-navy-950 mb-3">
            Thank you for your order!
          </h1>
          <p className="text-navy-500 text-base leading-relaxed mb-2">
            We&apos;ve received your order and our team will contact you within 2 hours to confirm delivery and payment details.
          </p>

          <Suspense>
            <OrderIdLabel />
          </Suspense>

          <div className="mt-8 grid sm:grid-cols-3 gap-3 text-left">
            {[
              { title: "1. Confirmation call", desc: "We verify availability and arrange delivery or pickup with you." },
              { title: "2. Payment", desc: "Use the method you selected: bank transfer, COD, or in-store." },
              { title: "3. Delivery", desc: "Delivery across Cyprus (fee may vary by location), white-glove install on request."},
            ].map(({ title, desc }) => (
              <div key={title} className="bg-navy-50/60 border border-navy-100 rounded-2xl p-4">
                <p className="text-navy-950 font-semibold text-sm mb-1">{title}</p>
                <p className="text-navy-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
            <Link href="/products" className="btn-gold text-sm">
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/" className="btn-ghost-dark text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
