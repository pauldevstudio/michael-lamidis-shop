import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { getSiteContent } from "@/lib/content";
import { listProducts } from "@/lib/products";

export const metadata = { title: "Catalog" };
export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ category?: string; brand?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const [products, allForFacets, content] = await Promise.all([
    listProducts({ category: sp.category, brand: sp.brand }),
    listProducts({ limit: 500 }),
    getSiteContent(),
  ]);

  const categories = Array.from(new Set(allForFacets.map((p) => p.category))).sort();
  const brands = Array.from(new Set(allForFacets.map((p) => p.brand))).sort();

  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-hero pt-12 pb-16 md:pt-20 md:pb-20">
          <Container width="wide">
            <p className="eyebrow">Catalog</p>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl">
              Every appliance, inspected.
            </h1>
            <p className="mt-3 text-base text-ink-500 md:text-lg max-w-prose">
              {products.length} item{products.length === 1 ? "" : "s"} ready to ship across Cyprus.
            </p>
          </Container>
        </section>

        <section className="py-12 md:py-16">
          <Container width="wide">
            <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
              <ProductFilters categories={categories} brands={brands} />
              <ProductGrid products={products} />
            </div>
          </Container>
        </section>
      </main>
      <Footer content={content} />
    </>
  );
}
