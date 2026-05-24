"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface Props {
  categories: string[];
  brands: string[];
}

export function ProductFilters({ categories, brands }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`${pathname}?${next.toString()}`);
    },
    [params, pathname, router]
  );

  return (
    <aside className="h-fit rounded-xl border border-ink-100 bg-white p-6 shadow-card">
      <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
        Filter
      </h3>

      <FilterGroup label="Category">
        <FilterSelect
          value={params.get("category") ?? ""}
          options={categories}
          onChange={(v) => setParam("category", v)}
        />
      </FilterGroup>

      <FilterGroup label="Brand">
        <FilterSelect
          value={params.get("brand") ?? ""}
          options={brands}
          onChange={(v) => setParam("brand", v)}
        />
      </FilterGroup>

      {(params.get("category") || params.get("brand")) && (
        <button
          onClick={() => router.push(pathname)}
          className="mt-6 text-xs font-medium text-gold-600 hover:text-gold-700 link-underline"
        >
          Clear filters
        </button>
      )}
    </aside>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <label className="block text-xs font-medium text-ink-700">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function FilterSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-md border border-ink-200 bg-white px-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-ink-900"
    >
      <option value="">All</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}
