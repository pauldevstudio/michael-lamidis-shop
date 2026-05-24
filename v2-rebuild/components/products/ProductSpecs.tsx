import type { ProductSpec } from "@/types";

interface Props { specs: ProductSpec[]; }

export function ProductSpecs({ specs }: Props) {
  if (specs.length === 0) return null;
  return (
    <div className="rounded-xl border border-ink-100 bg-white shadow-card">
      <h3 className="border-b border-ink-100 px-6 py-4 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
        Specifications
      </h3>
      <dl className="divide-y divide-ink-50 text-sm">
        {specs.map((s) => (
          <div key={s.label} className="grid grid-cols-[180px_1fr] gap-4 px-6 py-3">
            <dt className="text-ink-500">{s.label}</dt>
            <dd className="text-ink-900">{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
