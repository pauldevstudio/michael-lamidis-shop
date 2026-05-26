import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import ProductsContent from "./ProductsContent";
import { getPublicProducts } from "@/lib/site-content";

// Cache the rendered page for 30s. The admin's PUT /api/admin/products handler
// calls revalidatePath("/", "layout") after each save, so edits still appear
// immediately — but cart-icon / Shop Now navigations no longer wait for a
// MongoDB roundtrip on every hit.
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Products — Michael Lamidis | Certified Open Box Appliances",
  description:
    "Browse our full inventory of certified open box appliances. Refrigerators, washing machines, ovens, dishwashers, TVs and more — 30–70% off retail with 12-month warranty.",
};

export default async function ProductsPage() {
  const products = await getPublicProducts();
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <ProductsContent products={products} />
      </main>
      <Footer />
    </>
  );
}
