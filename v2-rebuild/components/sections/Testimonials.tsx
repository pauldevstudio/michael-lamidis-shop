import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/types";

interface Props { testimonials: Testimonial[]; }

export function Testimonials({ testimonials }: Props) {
  if (testimonials.length === 0) return null;
  return (
    <section className="section bg-bone-100/50">
      <Container width="wide">
        <SectionHeading
          eyebrow="Real customers"
          title="A few words from our showroom."
          description="Every appliance is delivered with our reputation attached. Here's what that's earned us."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <Reveal key={t.name + i} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-xl border border-ink-100 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover">
                <Quote className="h-7 w-7 text-gold-400" aria-hidden />
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink-800">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 border-t border-ink-100 pt-4">
                  <div className="font-heading text-sm font-semibold text-ink-900">
                    {t.name}
                  </div>
                  <div className="text-xs text-ink-500">
                    {[t.role, t.city].filter(Boolean).join(" · ")}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
