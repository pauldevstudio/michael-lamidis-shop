import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import CartContent from "./CartContent";

export const metadata: Metadata = {
  title: "Your Cart — Michael Lamidis",
  description: "Review the appliances you've added before checking out.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content" className="pt-24 pb-16 bg-white min-h-screen">
        <CartContent />
      </main>
      <Footer />
    </>
  );
}
