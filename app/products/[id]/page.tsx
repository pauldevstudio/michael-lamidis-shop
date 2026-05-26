import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import ProductDetail from "./ProductDetail";
import { getPublicProductById } from "@/lib/site-content";

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

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <ProductDetail product={product} />
      </main>
      <Footer />
    </>
  );
}
