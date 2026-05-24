"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Trash2, Plus } from "lucide-react";

interface FieldDef<T> {
  key: keyof T;
  label: string;
  type?: "text" | "textarea";
  placeholder?: string;
}

interface Props<T extends object> {
  label: string;
  items: T[];
  fields: FieldDef<T>[];
  empty: T;
  onChange: (next: T[]) => void;
}

export function ArrayField<T extends object>({
  label,
  items,
  fields,
  empty,
  onChange,
}: Props<T>) {
  function update(idx: number, key: keyof T, value: string) {
    const next = items.map((item, i) =>
      i === idx ? { ...item, [key]: value } : item
    );
    onChange(next);
  }
  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }
  function add() {
    onChange([...items, { ...empty }]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-ink-700">{label}</p>
        <Button type="button" size="sm" variant="secondary" onClick={add}>
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </div>
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-xs text-ink-400 italic">No items yet — click Add to create one.</p>
        )}
        {items.map((item, idx) => (
          <div key={idx} className="rounded-lg border border-ink-100 bg-bone-100/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                {fields.map((f) => {
                  const val = String((item as Record<keyof T, unknown>)[f.key] ?? "");
                  return (
                    <label key={String(f.key)} className="block">
                      <span className="block text-xs font-medium text-ink-600">{f.label}</span>
                      {f.type === "textarea" ? (
                        <textarea
                          rows={3}
                          value={val}
                          placeholder={f.placeholder}
                          onChange={(e) => update(idx, f.key, e.target.value)}
                          className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink-900"
                        />
                      ) : (
                        <input
                          type="text"
                          value={val}
                          placeholder={f.placeholder}
                          onChange={(e) => update(idx, f.key, e.target.value)}
                          className="mt-1 h-9 w-full rounded-md border border-ink-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ink-900"
                        />
                      )}
                    </label>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => remove(idx)}
                aria-label="Remove"
                className="grid h-8 w-8 place-items-center rounded-md text-ink-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
