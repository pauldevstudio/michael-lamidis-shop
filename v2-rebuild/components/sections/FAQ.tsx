"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/types";

interface Props { faqs: FaqItem[]; }

export function FAQ({ faqs }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="section bg-bone-100/50">
      <Container width="default">
        <SectionHeading
          eyebrow="Common questions"
          title="Everything you might be wondering."
          description="Don't see your question? Drop us a line — a human will reply within the hour during opening times."
        />
        <Reveal>
          <div className="mt-14 divide-y divide-ink-100 rounded-xl border border-ink-100 bg-white overflow-hidden">
            {faqs.map((f, i) => {
              const open = openIdx === i;
              return (
                <div key={f.question}>
                  <button
                    onClick={() => setOpenIdx(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-bone-100/60"
                  >
                    <span className="font-heading text-base font-semibold text-ink-900 md:text-lg">
                      {f.question}
                    </span>
                    <span className={cn(
                      "grid h-7 w-7 flex-shrink-0 place-items-center rounded-full transition-colors",
                      open ? "bg-ink-900 text-bone" : "bg-ink-50 text-ink-700"
                    )}>
                      {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-ink-600 md:text-base">
                        {f.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
