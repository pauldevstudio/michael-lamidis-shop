import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import type { SiteContent } from "@/types";

interface Props {
  content: Pick<SiteContent, "business">;
}

const linkColumns = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All products" },
      { href: "/products?category=Refrigeration", label: "Refrigeration" },
      { href: "/products?category=Cooking", label: "Cooking" },
      { href: "/products?category=Laundry", label: "Laundry" },
      { href: "/products?category=Dishwashers", label: "Dishwashers" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#about", label: "About us" },
      { href: "/#process", label: "How it works" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
];

export function Footer({ content }: Props) {
  const { business } = content;

  return (
    <footer id="contact" className="mt-24 bg-ink-900 text-bone">
      <Container width="wide" className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Logo dark />
            <p className="mt-5 text-sm leading-relaxed text-ink-300 max-w-xs">
              {business.tagline}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="grid h-9 w-9 place-items-center rounded-md border border-ink-700 text-bone hover:bg-bone hover:text-ink-900 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-md border border-ink-700 text-bone hover:bg-bone hover:text-ink-900 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {linkColumns.map((col) => (
            <div key={col.title}>
              <h4 className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-ink-300">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-ink-200 hover:text-bone transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-ink-300">
              Visit us
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-200">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-gold-300 flex-shrink-0" />
                <span>{business.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 mt-0.5 text-gold-300 flex-shrink-0" />
                <a href={`tel:${business.phone}`} className="hover:text-bone">{business.phone}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 mt-0.5 text-gold-300 flex-shrink-0" />
                <a href={`mailto:${business.email}`} className="hover:text-bone">{business.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 mt-0.5 text-gold-300 flex-shrink-0" />
                <span>{business.hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-ink-800">
        <Container width="wide" className="flex flex-col gap-3 py-5 text-xs text-ink-400 md:flex-row md:items-center md:justify-between">
          <span>&copy; {new Date().getFullYear()} {business.name}. All rights reserved.</span>
          <span>Premium open-box appliances · Cyprus</span>
        </Container>
      </div>
    </footer>
  );
}
