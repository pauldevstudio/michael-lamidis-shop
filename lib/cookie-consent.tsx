"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from "react";

/**
 * GDPR / ePrivacy cookie-consent state.
 *
 * Consent is stored in a first-party cookie named `cookie_consent` (12-month
 * expiry) as JSON: { necessary, analytics, marketing, v, ts }. The cookie is
 * intentionally NOT HttpOnly because the client must read it to decide whether
 * to inject analytics/marketing scripts. Non-essential scripts must never load
 * until the matching category is consented — see Analytics.tsx / AutoTrack.tsx.
 */

export type ConsentCategories = {
  necessary: true;       // always on — strictly necessary cookies
  analytics: boolean;
  marketing: boolean;
};

export type ConsentRecord = ConsentCategories & {
  v: number;             // policy/consent version — bump to re-prompt everyone
  ts: string;            // ISO timestamp the choice was made
};

export const CONSENT_COOKIE = "cookie_consent";
export const CONSENT_VERSION = 1;
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

// Module-level constants so the "no choice yet" / fallback values keep a stable
// identity across renders (avoids effect/deps churn).
const DENIED: ConsentCategories = { necessary: true, analytics: false, marketing: false };

function readConsentCookie(): ConsentRecord | null {
  if (typeof document === "undefined") return null;
  const hit = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  if (!hit) return null;
  try {
    const parsed = JSON.parse(
      decodeURIComponent(hit.slice(CONSENT_COOKIE.length + 1)),
    ) as ConsentRecord;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsentCookie(rec: ConsentRecord) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(rec))}` +
    `; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax${secure}`;
}

type ConsentContextValue = {
  ready: boolean;             // the stored cookie has been read on the client
  hasChoice: boolean;         // a valid, current-version choice exists
  consent: ConsentCategories; // effective consent (denied until a choice is saved)
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (choice: { analytics: boolean; marketing: boolean }) => void;
};

const NOOP: ConsentContextValue = {
  ready: false, hasChoice: false, consent: DENIED, settingsOpen: false,
  openSettings() {}, closeSettings() {}, acceptAll() {}, rejectAll() {}, save() {},
};

const CookieConsentContext = createContext<ConsentContextValue>(NOOP);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const existing = readConsentCookie();
    // Only honour a stored choice if it matches the current policy version;
    // otherwise we re-prompt (treated as "no choice yet").
    if (existing && existing.v === CONSENT_VERSION) setRecord(existing);
    setReady(true);
  }, []);

  const save = useCallback((choice: { analytics: boolean; marketing: boolean }) => {
    const rec: ConsentRecord = {
      necessary: true,
      analytics: choice.analytics,
      marketing: choice.marketing,
      v: CONSENT_VERSION,
      ts: new Date().toISOString(),
    };
    writeConsentCookie(rec);
    setRecord(rec);
    setSettingsOpen(false);
  }, []);

  const value = useMemo<ConsentContextValue>(() => ({
    ready,
    hasChoice: !!record,
    consent: record
      ? { necessary: true, analytics: record.analytics, marketing: record.marketing }
      : DENIED,
    settingsOpen,
    openSettings: () => setSettingsOpen(true),
    closeSettings: () => setSettingsOpen(false),
    acceptAll: () => save({ analytics: true, marketing: true }),
    rejectAll: () => save({ analytics: false, marketing: false }),
    save,
  }), [ready, record, settingsOpen, save]);

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): ConsentContextValue {
  return useContext(CookieConsentContext);
}
