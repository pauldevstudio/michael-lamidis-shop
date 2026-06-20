import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/shared/ScrollProgress";
import ProductDetail from "./ProductDetail";
import { getPublicProductById, getPublicProducts } from "@/lib/site-content";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { productSocialProof } from "@/lib/social-proof";

// Cache each product page for 30s. Admin saves call revalidatePath after PUT
// so edits still flush immediately.
export const revalidate = 30;

// Pre-render every product page at build time so the first click lands on an
// edge-cached page (~0.2s TTFB) instead of an on-demand server render (~1.3s),
// which is what made "View Details" feel slow. Products added later still
// render on first hit (dynamicParams defaults true), then cache like the rest.
export async function generateStaticParams() {
  try {
    const products = await getPublicProducts();
    return products.map((p) => ({ id: String(p.id) }));
  } catch {
    return [];
  }
}

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
    alternates: { canonical: `${SITE_URL}/products/${id}` },
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

  // Product structured data → eligible for Google rich results (price,
  // availability, rating stars). Ratings are the same deterministic social
  // proof shown on the page, so the markup matches visible content.
  const sp = productSocialProof(product.id);
  const absolute = (u: string) => (/^https?:\/\//i.test(u) ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`);
  const gallery = (product.images?.length ? product.images : [product.imageUrl]).filter(Boolean).map(absolute);
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.model}`,
    description: product.description,
    image: gallery,
    sku: product.id,
    mpn: product.model,
    brand: { "@type": "Brand", name: product.brand },
    aggregateRating: { "@type": "AggregateRating", ratingValue: sp.rating, reviewCount: sp.reviews },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.id}`,
      priceCurrency: "EUR",
      price: product.salePrice,
      itemCondition: "https://schema.org/RefurbishedCondition",
      availability: product.sold ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <ScrollProgress />
      <Navbar />
      <main>
        <ProductDetail product={product} related={related} />
      </main>
      <Footer />
    </>
  );
}
