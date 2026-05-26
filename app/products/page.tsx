import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import ProductsContent from "./ProductsContent";
import { getSiteContent } from "@/lib/site-content";

// Always read fresh products from MongoDB so admin edits show on the live site.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products — Michael Lamidis | Certified Open Box Appliances",
  description:
    "Browse our full inventory of certified open box appliances. Refrigerators, washing machines, ovens, dishwashers, TVs and more — 30–70% off retail with 12-month warranty.",
};

export default async function ProductsPage() {
  const content = await getSiteContent();
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <ProductsContent products={content.products} />
      </main>
      <Footer />
    </>
  );
}
