import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import type { SiteContent } from "@/types";

interface Props {
  hero: SiteContent["hero"];
  stats: SiteContent["stats"];
}

export function Hero({ hero, stats }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Subtle grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#0a0f1c_1px,transparent_1px),linear-gradient(to_bottom,#0a0f1c_1px,transparent_1px)] bg-[size:64px_64px]"
      />
      <Container width="wide" className="relative pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-32 lg:pb-36">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-bone/80 px-3.5 py-1.5 text-xs font-medium text-ink-700 backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-gold-500" />
              {hero.badge}
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-6 font-heading text-[2.5rem] leading-[2.75rem] font-bold tracking-tight text-ink-900 sm:text-5xl sm:leading-[3.5rem] md:text-6xl md:leading-[4rem] lg:text-[4rem] lg:leading-[4.25rem]">
              {hero.headline}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-5 text-lg leading-relaxed text-ink-600 max-w-prose mx-auto md:text-xl md:leading-relaxed">
              {hero.subheadline}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  {hero.ctaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#contact">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  {hero.ctaSecondary}
                </Button>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 flex items-center justify-center gap-2 text-xs text-ink-500">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span>Trusted by 5,000+ Cypriot households</span>
            </div>
          </Reveal>
        </div>

        {/* Stats strip */}
        <Reveal delay={0.25}>
          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-ink-100 py-8 md:grid-cols-4 md:py-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="font-heading text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
                  {s.value}
                </dt>
                <dd className="mt-1.5 text-xs uppercase tracking-[0.12em] text-ink-500">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
