import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types";

interface Props { categories: Category[]; }

export function Categories({ categories }: Props) {
  if (categories.length === 0) return null;
  return (
    <section className="section bg-bone-100/50">
      <Container width="wide">
        <SectionHeading
          eyebrow="Shop by category"
          title="Find your appliance, faster."
          description="From compact wine coolers to professional-grade range hoods — every category is fully stocked, fully inspected."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.06}>
              <Link
                href={c.href ?? `/products?category=${encodeURIComponent(c.name)}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-ink-900 shadow-card transition-shadow hover:shadow-elevated"
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover opacity-80 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <h3 className="font-heading text-xl font-semibold text-bone">{c.name}</h3>
                  {c.tagline && (
                    <p className="mt-1 text-sm text-bone/80">{c.tagline}</p>
                  )}
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Browse <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
