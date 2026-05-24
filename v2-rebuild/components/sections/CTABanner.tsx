import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Phone } from "lucide-react";
import type { SiteContent } from "@/types";

interface Props {
  cta: SiteContent["cta"];
  phone: string;
}

export function CTABanner({ cta, phone }: Props) {
  return (
    <section className="section">
      <Container width="wide">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-ink-900 px-6 py-14 text-center sm:px-12 md:py-20 lg:py-24">
            {/* subtle texture */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#fafaf7_1px,transparent_1px),linear-gradient(to_bottom,#fafaf7_1px,transparent_1px)] bg-[size:48px_48px]"
            />
            <div
              aria-hidden
              className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl"
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-bone sm:text-4xl md:text-5xl">
                {cta.headline}
              </h2>
              <p className="mt-5 text-base text-ink-300 md:text-lg max-w-prose mx-auto">
                {cta.subheadline}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/products">
                  <Button size="lg" variant="gold" className="w-full sm:w-auto">
                    {cta.ctaPrimary}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href={`tel:${phone}`}>
                  <Button size="lg" variant="ghost" className="w-full sm:w-auto text-bone hover:bg-bone/10">
                    <Phone className="h-4 w-4" />
                    {cta.ctaSecondary}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
