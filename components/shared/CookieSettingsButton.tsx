"use client";

import { useCookieConsent } from "@/lib/cookie-consent";
import { useLanguage } from "@/lib/i18n-context";

/**
 * Reopens the cookie consent banner so visitors can review or withdraw consent
 * at any time. Used on the Cookie Policy page and in the footer.
 *
 * `variant="link"` renders as a plain footer-style link; default renders a
 * visible bordered button.
 */
export default function CookieSettingsButton({
  variant = "button",
  className = "",
}: {
  variant?: "button" | "link";
  className?: string;
}) {
  const { openSettings } = useCookieConsent();
  const { lang } = useLanguage();
  const label = lang === "gr" ? "Ρυθμίσεις Cookies" : "Cookie Settings";

  if (variant === "link") {
    return (
      <button type="button" onClick={openSettings} className={className}>
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openSettings}
      className={`inline-flex items-center gap-2 rounded-lg border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-800 hover:border-navy-400 hover:bg-navy-50 transition-colors ${className}`}
    >
      {label}
    </button>
  );
}
