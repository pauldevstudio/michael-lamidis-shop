import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import ProductDetail from "./ProductDetail";
import { getSiteContent } from "@/lib/site-content";

// Always read fresh content so admin edits show up immediately.
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const content = await getSiteContent();
  const product = content.products.find((p) => p.id === id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.brand} ${product.model} - Michael Lamidis`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const content = await getSiteContent();
  const product = content.products.find((p) => p.id === id);
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
