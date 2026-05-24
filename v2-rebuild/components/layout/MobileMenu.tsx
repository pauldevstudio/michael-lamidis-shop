"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navLinks } from "./nav-links";
import { Button } from "@/components/ui/Button";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-md text-ink-900 hover:bg-ink-50"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-bone">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <span className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">
              Menu
            </span>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-md text-ink-900 hover:bg-ink-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col px-5 py-8 gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-lg font-medium text-ink-900 hover:bg-ink-50"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-6 px-3">
              <Link href="/products" onClick={() => setOpen(false)}>
                <Button size="lg" className="w-full">Shop the catalog</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
