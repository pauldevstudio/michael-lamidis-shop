"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Lock } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import CartIndicator from "@/components/layout/CartIndicator";
import { cn } from "@/lib/utils";
import { SITE_PHONE } from "@/lib/constants";

// framer-motion's AnimatePresence with initial={...} emits inline styles on
// mount that diverge from SSR HTML and trigger React hydration mismatches.
// Loading the bar client-only sidesteps SSR entirely.
const AnnouncementBar = dynamic(
  () => import("@/components/shared/AnnouncementBar"),
  { ssr: false }
);

const navLinks = [
  { href: "/", key: "home" as const },
  { href: "/products", key: "products" as const },
  { href: "/about", key: "about" as const },
  { href: "/testimonials", key: "testimonials" as const },
  { href: "/contact", key: "contact" as const },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { t, pick } = useLanguage();
  const content = useContent();
  const __nav = content?.navigation;
  // Always use translations for nav labels (translations are source of truth after the
  // catalog pivot). CMS navigation global is no longer authoritative for link text.
  const __navItems = navLinks.map((l) => ({ href: l.href, label: t.nav[l.key], key: l.href }));
  const __ctaLabel = pick(__nav?.getQuoteLabel, t.nav.getQuote);
  const __ctaHref  = __nav?.getQuoteHref  ?? "/contact";
  const phone = content?.business?.phone ?? SITE_PHONE;
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-navy-950/95 backdrop-blur-xl border-b border-white/[0.06] shadow-nav-dark"
            : "bg-transparent"
        )}
      >
        {!scrolled && <AnnouncementBar />}

        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-5">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label="Michael Lamidis — home"
            >
              <Image
                src="/logo.png"
                alt="Michael Lamidis logo"
                width={40}
                height={40}
                priority
                className="w-9 h-9 sm:w-10 sm:h-10 shrink-0"
              />
              <span className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight hidden sm:inline">
                Michael <span className="text-gold-500">Lamidis</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1 mx-auto">
              {__navItems.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium tracking-wide transition-colors rounded-md",
                      active ? "text-gold-400" : "text-white/80 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <Link
                href="/admin"
                aria-label="Admin login"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-navy-950 text-xs font-black tracking-widest uppercase transition-all shadow-md ring-1 ring-amber-300/50"
              >
                <Lock className="w-3.5 h-3.5" />
                Admin
              </Link>

              <LanguageSwitcher className="hidden sm:inline-flex" />

              <CartIndicator />

              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="hidden md:inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                aria-label="Call us"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">{phone}</span>
              </a>

              <Link
                href={__ctaHref}
                className="hidden sm:inline-flex items-center px-4 py-2 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-lg text-sm font-semibold transition-colors"
              >
                {__ctaLabel}
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden p-2 text-white"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden bg-navy-950/98 backdrop-blur-xl pt-24 px-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-1">
              {__navItems.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-3 text-lg font-medium rounded-lg transition-colors",
                      active ? "text-gold-400 bg-white/5" : "text-white/90 hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="mt-6 flex items-center gap-3">
                <LanguageSwitcher />
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase border border-white/15 text-white/70 hover:text-white hover:border-white/30 hover:bg-white/8 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {phone}
                </a>
              </div>

              <Link
                href="/contact"
                className="mt-6 inline-flex items-center justify-center px-5 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 rounded-lg font-semibold transition-colors"
              >
                {__ctaLabel}
              </Link>

              <Link
                href="/admin"
                aria-label="Admin login"
                className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-white/20 text-white/80 hover:text-white hover:border-white/40 hover:bg-white/5 text-sm font-bold tracking-widest uppercase transition-all"
              >
                <Lock className="w-4 h-4" />
                Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
