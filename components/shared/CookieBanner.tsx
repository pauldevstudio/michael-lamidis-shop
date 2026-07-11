"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, BarChart3, Megaphone, X } from "lucide-react";
import { useCookieConsent } from "@/lib/cookie-consent";
import { useLanguage } from "@/lib/i18n-context";

const COPY = {
  en: {
    title: "We value your privacy",
    body: "We use strictly necessary cookies to make this site work. With your consent, we also use analytics cookies to understand how the site is used. You can accept all, reject non-essential cookies, or choose what to allow. Read our",
    and: "and",
    cookiePolicy: "Cookie Policy",
    privacyPolicy: "Privacy Policy",
    acceptAll: "Accept All",
    rejectAll: "Reject All",
    customize: "Customize",
    save: "Save preferences",
    close: "Close",
    necessary: "Strictly necessary",
    necessaryDesc: "Required for the site to work — security, your session and remembering this cookie choice. Always on.",
    analytics: "Analytics",
    analyticsDesc: "Help us measure visits and improve the site (Google Analytics and our own first-party statistics).",
    marketing: "Marketing",
    marketingDesc: "Used to measure or personalise advertising. We do not run any marketing cookies at the moment.",
    alwaysOn: "Always on",
  },
  gr: {
    title: "Σεβόμαστε το απόρρητό σας",
    body: "Χρησιμοποιούμε απολύτως απαραίτητα cookies για τη λειτουργία του ιστότοπου. Με τη συγκατάθεσή σας, χρησιμοποιούμε επίσης cookies ανάλυσης για να κατανοούμε τη χρήση του ιστότοπου. Μπορείτε να τα αποδεχθείτε όλα, να απορρίψετε τα μη απαραίτητα ή να επιλέξετε τι επιτρέπετε. Διαβάστε την",
    and: "και την",
    cookiePolicy: "Πολιτική Cookies",
    privacyPolicy: "Πολιτική Απορρήτου",
    acceptAll: "Αποδοχή Όλων",
    rejectAll: "Απόρριψη Όλων",
    customize: "Προσαρμογή",
    save: "Αποθήκευση",
    close: "Κλείσιμο",
    necessary: "Απολύτως απαραίτητα",
    necessaryDesc: "Απαραίτητα για τη λειτουργία του ιστότοπου — ασφάλεια, συνεδρία και αποθήκευση της επιλογής cookies. Πάντα ενεργά.",
    analytics: "Ανάλυσης",
    analyticsDesc: "Μας βοηθούν να μετράμε τις επισκέψεις και να βελτιώνουμε τον ιστότοπο (Google Analytics και δικά μας στατιστικά).",
    marketing: "Μάρκετινγκ",
    marketingDesc: "Για μέτρηση ή εξατομίκευση διαφημίσεων. Προς το παρόν δεν χρησιμοποιούμε cookies μάρκετινγκ.",
    alwaysOn: "Πάντα ενεργά",
  },
} as const;

export default function CookieBanner() {
  const { ready, hasChoice, settingsOpen, acceptAll, rejectAll, save, closeSettings, consent } =
    useCookieConsent();
  const { lang } = useLanguage();
  const t = COPY[lang === "gr" ? "gr" : "en"];

  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // When (re)opened from the footer "Cookie Settings", expand and preload the
  // current saved choices so users can withdraw/adjust consent.
  useEffect(() => {
    if (settingsOpen) {
      setExpanded(true);
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
    }
  }, [settingsOpen, consent.analytics, consent.marketing]);

  // Don't render until we've read the cookie (avoids hydration flash), and only
  // when there is no stored choice yet OR the user reopened settings.
  if (!ready) return null;
  const visible = !hasChoice || settingsOpen;
  if (!visible) return null;

  const Category = ({
    icon: Icon, title, desc, checked, onChange, locked,
  }: {
    icon: typeof ShieldCheck; title: string; desc: string;
    checked: boolean; onChange?: (v: boolean) => void; locked?: boolean;
  }) => (
    <div className="flex items-start gap-3 py-3 border-t border-white/10">
      <Icon className="w-4 h-4 text-gold-400 mt-1 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <span className="text-white font-semibold text-sm">{title}</span>
          {locked ? (
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold shrink-0">
              {t.alwaysOn}
            </span>
          ) : (
            <button
              type="button"
              role="switch"
              aria-checked={checked}
              aria-label={title}
              onClick={() => onChange?.(!checked)}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                checked ? "bg-gold-500" : "bg-white/20"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  checked ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          )}
        </div>
        <p className="text-white/50 text-xs leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t.title}
      className="fixed inset-x-0 bottom-0 z-[10000] p-3 sm:p-4 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-white/10 bg-navy-950/95 backdrop-blur-xl shadow-[0_-8px_40px_rgba(0,0,0,0.5)] p-5 sm:p-6 relative">
        {settingsOpen && (
          <button
            type="button"
            onClick={closeSettings}
            aria-label={t.close}
            className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold-500/15 flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5 text-gold-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-display font-bold text-base" style={{ fontFamily: "var(--font-jakarta)" }}>
              {t.title}
            </h2>
            <p className="text-white/55 text-xs sm:text-sm leading-relaxed mt-1.5">
              {t.body}{" "}
              <Link href="/cookie-policy" className="text-gold-400 underline hover:text-gold-300">{t.cookiePolicy}</Link>{" "}
              {t.and}{" "}
              <Link href="/privacy-policy" className="text-gold-400 underline hover:text-gold-300">{t.privacyPolicy}</Link>.
            </p>
          </div>
        </div>

        {expanded && (
          <div className="mt-4">
            <Category icon={ShieldCheck} title={t.necessary} desc={t.necessaryDesc} checked locked />
            <Category icon={BarChart3} title={t.analytics} desc={t.analyticsDesc} checked={analytics} onChange={setAnalytics} />
            <Category icon={Megaphone} title={t.marketing} desc={t.marketingDesc} checked={marketing} onChange={setMarketing} />
          </div>
        )}

        {/* Actions — Accept All and Reject All share equal prominence */}
        <div className="mt-5 flex flex-col sm:flex-row gap-2.5 sm:items-center">
          <button
            type="button"
            onClick={acceptAll}
            className="btn-gold text-sm justify-center order-1 sm:order-3 flex-1"
          >
            {t.acceptAll}
          </button>
          <button
            type="button"
            onClick={rejectAll}
            className="text-sm justify-center order-2 flex-1 rounded-lg px-5 py-2.5 font-semibold bg-white/10 text-white hover:bg-white/15 border border-white/15 transition-colors"
          >
            {t.rejectAll}
          </button>
          {expanded ? (
            <button
              type="button"
              onClick={() => save({ analytics, marketing })}
              className="text-sm justify-center order-3 sm:order-1 rounded-lg px-5 py-2.5 font-semibold text-white/70 hover:text-white border border-white/15 transition-colors"
            >
              {t.save}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="text-sm justify-center order-3 sm:order-1 rounded-lg px-5 py-2.5 font-semibold text-white/60 hover:text-white transition-colors"
            >
              {t.customize}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
