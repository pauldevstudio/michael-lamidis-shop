"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { navLinks } from "./nav-links";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-ink-100 bg-bone/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <Container width="wide" className="flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:text-ink-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Link href="/products">
            <Button size="sm" variant="primary">Shop the catalog</Button>
          </Link>
        </div>
        <MobileMenu />
      </Container>
    </header>
  );
}
