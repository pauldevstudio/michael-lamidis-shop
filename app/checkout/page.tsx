import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import CheckoutContent from "./CheckoutContent";

export const metadata: Metadata = {
  title: "Checkout — Michael Lamidis",
  description: "Place your order. Pay by bank transfer, cash on delivery, or in-store pickup.",
};

export default function CheckoutPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="pt-24 pb-16 bg-white min-h-screen">
        <CheckoutContent />
      </main>
      <Footer />
    </>
  );
}
