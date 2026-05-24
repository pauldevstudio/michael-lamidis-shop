"use client";

import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function AdminHeader({ title, subtitle, actions }: Props) {
  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-slate-900 font-display font-bold text-xl leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
