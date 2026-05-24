import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { Brand } from "@/types";

interface Props { brands: Brand[]; }

export function TrustStrip({ brands }: Props) {
  if (brands.length === 0) return null;
  return (
    <section className="border-y border-ink-100 bg-bone-100/40 py-10 md:py-14">
      <Container width="wide">
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-ink-500">
            Brands we carry
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-14">
            {brands.map((b) => (
              <li
                key={b.name}
                className="font-heading text-base font-semibold tracking-tight text-ink-400 transition-colors hover:text-ink-700 sm:text-lg"
              >
                {b.name}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
