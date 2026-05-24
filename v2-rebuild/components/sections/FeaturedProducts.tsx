import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";

interface Props { products: Product[]; }

export function FeaturedProducts({ products }: Props) {
  if (products.length === 0) return null;
  return (
    <section className="section bg-bone">
      <Container width="wide">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="This week's picks"
            title="Hand-picked open box bargains."
            description="Refreshed every Monday by the team. Limited stock, first come first served."
            align="left"
            className="max-w-2xl"
          />
          <Link href="/products" className="hidden md:inline-flex">
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Reveal>
          <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </Reveal>
        <div className="mt-10 text-center md:hidden">
          <Link href="/products">
            <Button variant="secondary" size="md">
              View all products <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
