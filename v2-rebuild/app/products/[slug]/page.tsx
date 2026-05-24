import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductSpecs } from "@/components/products/ProductSpecs";
import { InquiryForm } from "@/components/products/InquiryForm";
import { getSiteContent } from "@/lib/content";
import { getProductBySlug } from "@/lib/products";
import { formatPrice, discountPercent } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return { title: product.name, description: product.description.slice(0, 160) };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, content] = await Promise.all([
    getProductBySlug(slug),
    getSiteContent(),
  ]);
  if (!product) notFound();

  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <>
      <Header />
      <main>
        <Container width="wide" className="pt-8">
          <nav className="flex items-center gap-2 text-xs text-ink-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-ink-900">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-ink-900">Catalog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink-700">{product.name}</span>
          </nav>
        </Container>

        <Container width="wide" className="py-10 md:py-14">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <ProductGallery images={product.images} alt={product.name} />

            <div>
              <p className="eyebrow">{product.brand}</p>
              <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-heading text-4xl font-bold text-ink-900">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-ink-400 line-through">
                    {formatPrice(product.originalPrice, product.currency)}
                  </span>
                )}
                {discount && <Badge tone="danger">−{discount}%</Badge>}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge tone="gold">{product.condition.replace("-", " ")}</Badge>
                <Badge tone={product.stock > 0 ? "success" : "warning"}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Awaiting restock"}
                </Badge>
                <Badge tone="info">12-mo warranty</Badge>
              </div>

              <p className="mt-7 text-base leading-relaxed text-ink-700">
                {product.description}
              </p>

              <div className="mt-8">
                <InquiryForm productSlug={product.slug} productName={product.name} />
              </div>
            </div>
          </div>

          <div className="mt-16">
            <ProductSpecs specs={product.specs} />
          </div>
        </Container>
      </main>
      <Footer content={content} />
    </>
  );
}
