import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PricingTier } from "@/types";

interface Props { tiers: PricingTier[]; }

export function PricingTiers({ tiers }: Props) {
  if (tiers.length === 0) return null;
  return (
    <section id="pricing" className="section bg-bone">
      <Container width="wide">
        <SectionHeading
          eyebrow="Honest pricing"
          title="Tiers that match your kitchen."
          description="Indicative savings against typical retail prices. Every tier includes our 12-month Lamidis warranty."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-xl border p-7 transition-all duration-300",
                  t.featured
                    ? "border-ink-900 bg-ink-900 text-bone shadow-elevated lg:-translate-y-2"
                    : "border-ink-100 bg-white text-ink-900 shadow-card hover:shadow-card-hover"
                )}
              >
                {t.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-400 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-900">
                    Most popular
                  </span>
                )}
                <h3 className="font-heading text-xl font-semibold">{t.name}</h3>
                <p className={cn("mt-1 text-sm", t.featured ? "text-ink-300" : "text-ink-500")}>
                  {t.tagline}
                </p>
                <div className="mt-6">
                  <div className={cn("font-heading text-4xl font-bold tracking-tight", t.featured ? "text-bone" : "text-ink-900")}>
                    {t.savings}
                  </div>
                  <div className={cn("mt-1 text-xs uppercase tracking-wider", t.featured ? "text-ink-400" : "text-ink-500")}>
                    vs typical retail
                  </div>
                </div>
                <ul className="mt-7 space-y-3 flex-1">
                  {t.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm">
                      <Check className={cn("h-4 w-4 mt-0.5 flex-shrink-0", t.featured ? "text-gold-300" : "text-gold-500")} />
                      <span className={t.featured ? "text-ink-100" : "text-ink-700"}>{h}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/products" className="mt-7">
                  <Button
                    variant={t.featured ? "gold" : "outline"}
                    className="w-full"
                  >
                    Browse this tier
                  </Button>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
