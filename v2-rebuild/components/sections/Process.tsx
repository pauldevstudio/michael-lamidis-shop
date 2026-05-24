import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ProcessStep } from "@/types";

interface Props { steps: ProcessStep[]; }

export function Process({ steps }: Props) {
  if (steps.length === 0) return null;
  return (
    <section id="process" className="section bg-bone">
      <Container width="wide">
        <SectionHeading
          eyebrow="How buying works"
          title="From browse to delivered — in four steps."
          description="No haggling, no surprises. Here's exactly what happens between you spotting an appliance and us bringing it through your door."
        />

        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute left-6 top-2 h-[calc(100%-1rem)] w-px bg-ink-100 lg:left-0 lg:top-6 lg:h-px lg:w-full"
          />
          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <li className="relative flex gap-5 lg:block lg:gap-0">
                  <div className="relative z-10 grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-ink-900 font-heading text-base font-semibold text-bone shadow-card">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="lg:mt-6">
                    <h3 className="font-heading text-lg font-semibold text-ink-900">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
