import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import ProductsContent from "./ProductsContent";
import { getPublicProducts, getSiteContent } from "@/lib/site-content";
import { SITE_URL } from "@/lib/constants";

// Cache the rendered HTML at the edge. force-static + revalidate makes
// Vercel actually send s-maxage=N instead of no-cache (Mongoose isn't a
// Next.js fetch, so without force-static it defaults to dynamic). The
// admin's PUT /api/admin/products calls revalidatePath after each save,
// so live edits still flush the cache immediately.
export const dynamic = "force-static";
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Products — Michael Lamidis | Certified Open Box Appliances",
  description:
    "Browse our full inventory of certified open box appliances. Refrigerators, washing machines, ovens, dishwashers, TVs and more — 30–70% off retail with 12-month warranty.",
  alternates: { canonical: `${SITE_URL}/products` },
};

export default async function ProductsPage() {
  const [products, content] = await Promise.all([getPublicProducts(), getSiteContent()]);
  // Best Deals filter = exactly the products picked in the admin Best Deals tab
  // (its own list, separate from the popup), limited to products that still exist.
  const validIds = new Set(products.map((p) => p.id));
  const bestDealIds = content.bestDeals.productIds.filter((id) => id && validIds.has(id));
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Open Box Appliances & Furniture — Michael Lamidis",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/products/${p.id}`,
      name: `${p.brand} ${p.model}`,
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <ScrollProgress />
      <Navbar />
      <main>
        <ProductsContent products={products} bestDealIds={bestDealIds} />
      </main>
      <Footer />
    </>
  );
}
