import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import ProductDetail from "./ProductDetail";
import { FEATURED_PRODUCTS } from "@/lib/constants";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return FEATURED_PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = FEATURED_PRODUCTS.find((p) => p.id === id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.brand} ${product.model} — Michael Lamidis`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = FEATURED_PRODUCTS.find((p) => p.id === id);
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
