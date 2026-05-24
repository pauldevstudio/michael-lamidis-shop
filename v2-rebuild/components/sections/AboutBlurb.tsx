import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteContent } from "@/types";

interface Props {
  about: SiteContent["about"];
}

export function AboutBlurb({ about }: Props) {
  return (
    <section id="about" className="section bg-bone">
      <Container width="default">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-100 shadow-elevated">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200"
                alt="Showroom interior"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="eyebrow">Our story</p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl md:text-[2.5rem] md:leading-[2.875rem]">
              {about.headline}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-600 md:text-lg">
              {about.body}
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-ink-100 pt-8">
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-ink-500">Founded</dt>
                <dd className="mt-1 font-heading text-2xl font-bold text-ink-900">2014</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-ink-500">Showroom</dt>
                <dd className="mt-1 font-heading text-2xl font-bold text-ink-900">Limassol</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
