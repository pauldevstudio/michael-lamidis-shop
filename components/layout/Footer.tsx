"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Facebook, Instagram, Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle, Lock } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";
import { useContent } from "@/lib/content-context";
import CookieSettingsButton from "@/components/shared/CookieSettingsButton";
import { SITE_ADDRESS, SITE_EMAIL, SITE_HOURS, SITE_PHONE, SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  const { t, lang, pick } = useLanguage();
  const __content = useContent();
  const __ft = __content?.footer;
  const __ftDescription  = pick(__ft?.description, t.footer.description);
  const __ftCopyright    = lang === "en" && __ft?.copyright ? `© ${new Date().getFullYear()} ${__ft.copyright}` : t.footer.copyright;
  // Greek: always use translations. English: prefer CMS if filled.
  const __ftCompanyLinks  = (lang === "en" && __ft?.companyLinks  && __ft.companyLinks.length  > 0) ? __ft.companyLinks  : t.footer.companyLinks;
  const __ftServicesLinks = (lang === "en" && __ft?.servicesLinks && __ft.servicesLinks.length > 0) ? __ft.servicesLinks : t.footer.servicesLinks;
  const content = useContent();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Use live content from CMS if available, otherwise fall back to constants
  const phone   = content?.business?.phone   ?? SITE_PHONE;
  const mail    = content?.business?.email   ?? SITE_EMAIL;
  const address = content?.business?.address ?? SITE_ADDRESS;
  const hours   = content?.business?.hours   ?? SITE_HOURS;
  const social  = content?.business?.social  ?? SOCIAL_LINKS;
  const name    = content?.business?.name    ?? "Michael Lamidis";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-navy-950 noise-overlay relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-500/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-gold-500/6 blur-[120px] pointer-events-none" />

      {/* Top divider */}
      <div className="divider-gold opacity-20" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main content */}
        <div className="pt-16 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <Image
                src="/logo.webp"
                alt="Michael Lamidis logo"
                width={40}
                height={40}
                className="w-10 h-10 shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-white font-display font-bold text-lg leading-tight">{name}</span>
                <span className="text-white/50 text-[10px] font-medium tracking-wider uppercase">Open Box Shop</span>
              </div>
            </Link>

            <p className="text-white/45 text-sm leading-relaxed max-w-xs">
              {__ftDescription}
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-3">
              {[
                { icon: MapPin, text: address, href: "https://www.google.com/maps/place/Michael+Lamidis+Appliances+Store/@34.7616632,32.9508341,17z" },
                { icon: Phone, text: phone,  href: `tel:${phone.replace(/\s/g, "")}` },
                { icon: Mail,  text: mail,   href: `mailto:${mail}` },
                { icon: Clock, text: hours },
              ].map(({ icon: Icon, text, href }) => (
                <div key={text} className="flex items-start gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-gold-500 mt-0.5 shrink-0" />
                  {href ? (
                    <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="text-white/45 text-xs hover:text-white/70 transition-colors leading-relaxed">
                      {text}
                    </a>
                  ) : (
                    <span className="text-white/45 text-xs leading-relaxed">{text}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex items-center gap-2">
              {[
                { href: social.facebook, Icon: Facebook, label: "Facebook" },
                { href: social.instagram, Icon: Instagram, label: "Instagram" },
              ]
                .filter((s) => s.href)
                .map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-lg border border-white/[0.1] flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 hover:bg-white/[0.06] transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-6">
            {[
              { title: t.footer.companyTitle,  links: __ftCompanyLinks },
              { title: t.footer.servicesTitle, links: __ftServicesLinks },
              { title: t.footer.supportTitle,  links: t.footer.supportLinks },
            ].map(({ title, links }) => (
              <nav key={title} aria-label={title} className="flex flex-col gap-4">
                <span className="text-white text-xs font-bold uppercase tracking-widest">{title}</span>
                <ul className="flex flex-col gap-2.5">
                  {links.map(({ label, href }) => (
                    <li key={`${label}-${href}`}>
                      <Link
                        href={href}
                        className="text-white/50 text-sm hover:text-white/80 transition-colors duration-200 leading-snug"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <span className="text-white text-xs font-bold uppercase tracking-widest">
              {t.footer.newsletterTitle}
            </span>
            <p className="text-white/50 text-sm leading-relaxed">
              Get exclusive deals and early access to our best open box finds.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>You&apos;re subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                <label htmlFor="footer-email" className="sr-only">{t.footer.newsletterPlaceholder}</label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.footer.newsletterPlaceholder}
                  required
                  className="form-input text-sm"
                />
                <button type="submit" className="btn-gold text-sm !px-4 !py-2.5 justify-between">
                  {t.footer.newsletterCta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Trust seals */}
            <div className="flex items-center gap-3 pt-2">
              <div className="glass-card rounded-lg px-3 py-2 flex items-center gap-1.5">
                <span className="text-gold-400 text-xs">★</span>
                <span className="text-white/60 text-xs font-medium">4.9/5 Rating</span>
              </div>
              <div className="glass-card rounded-lg px-3 py-2 flex items-center gap-1.5">
                <span className="text-emerald-400 text-xs">✓</span>
                <span className="text-white/60 text-xs font-medium">Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="border-t border-white/[0.06] py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-[11px] font-medium uppercase tracking-widest">
              Secure Payment
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {[
                { label: "VISA",          bg: "#1a1f71", text: "#fff",    italic: true  },
                { label: "MC",            bg: "#eb001b", text: "#fff",    italic: false },
                { label: "PayPal",        bg: "#003087", text: "#009cde", italic: false },
                { label: "Apple Pay",     bg: "#000",    text: "#fff",    italic: false },
                { label: "Google Pay",    bg: "#fff",    text: "#1a73e8", italic: false },
                { label: "Bank Transfer", bg: "#0f766e", text: "#fff",    italic: false },
              ].map(({ label, bg, text, italic }) => (
                <div
                  key={label}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-extrabold tracking-tight select-none"
                  style={{ background: bg, color: text, fontStyle: italic ? "italic" : "normal" }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-xs font-medium text-center sm:text-left">
            {__ftCopyright}
          </p>
          <div className="flex items-center gap-5">
            {t.footer.legal.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-white/50 text-xs hover:text-white/60 transition-colors"
              >
                {label}
              </Link>
            ))}
            <CookieSettingsButton
              variant="link"
              className="text-white/50 text-xs hover:text-white/60 transition-colors"
            />
            <Link
              href="/admin"
              aria-label="Admin login"
              className="inline-flex items-center gap-1 text-white/50 text-xs hover:text-white/60 transition-colors"
            >
              <Lock className="w-3 h-3" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
