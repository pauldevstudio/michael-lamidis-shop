import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import ProductDetail from "./ProductDetail";
import { getPublicProductById, getPublicProducts } from "@/lib/site-content";

// Cache each product page for 30s. Admin saves call revalidatePath after PUT
// so edits still flush immediately.
export const revalidate = 30;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getPublicProductById(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.brand} ${product.model} - Michael Lamidis`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getPublicProductById(id);
  if (!product) notFound();

  // Related products must come from the live product list (same source this
  // page resolves from) — not the static FEATURED_PRODUCTS seed, whose old IDs
  // 404 when clicked. Prefer same-category, fall back to any other product.
  const all = await getPublicProducts();
  const sameCategory = all.filter((p) => p.category === product.category && p.id !== product.id);
  const related = (sameCategory.length > 0 ? sameCategory : all.filter((p) => p.id !== product.id)).slice(0, 3);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <ProductDetail product={product} related={related} />
      </main>
      <Footer />
    </>
  );
}
