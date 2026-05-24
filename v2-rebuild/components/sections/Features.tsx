import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShieldCheck, BadgeCheck, Truck, Headphones, Sparkles, Award } from "lucide-react";
import type { Feature } from "@/types";

const ICONS = {
  "shield-check": ShieldCheck,
  "badge-check": BadgeCheck,
  truck: Truck,
  headphones: Headphones,
  sparkles: Sparkles,
  award: Award,
} as const;

type IconKey = keyof typeof ICONS;

interface Props { features: Feature[]; }

export function Features({ features }: Props) {
  if (features.length === 0) return null;
  return (
    <section className="section bg-bone">
      <Container width="wide">
        <SectionHeading
          eyebrow="Why Michael Lamidis"
          title="Premium quality. Honest prices. Real humans."
          description="Open box doesn't mean second best. It means smarter — and we put every appliance through the same care a brand-new one would get."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = ICONS[f.icon as IconKey] ?? ShieldCheck;
            return (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="group h-full rounded-xl border border-ink-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-ink-200">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-ink-900 text-bone transition-colors group-hover:bg-gold-500">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold text-ink-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {f.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
