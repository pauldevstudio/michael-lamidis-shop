import { Container } from "@/components/ui/Container";
import type { SiteContent } from "@/types";

interface Props {
  stats: SiteContent["stats"];
}

export function Stats({ stats }: Props) {
  return (
    <section className="border-y border-slate-200 bg-white">
      <Container className="py-10">
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <dt className="text-2xl font-heading font-bold text-brand-600 sm:text-3xl">
                {s.value}
              </dt>
              <dd className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
