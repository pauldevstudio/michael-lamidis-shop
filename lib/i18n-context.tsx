"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, type Language, type T } from "./translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: T;
  /**
   * Pick between a CMS-provided value and a translation-file value, respecting
   * the current language. When the user is on Greek, the translation always
   * wins (because CMS values are stored in only one language). When on English,
   * the CMS value wins so admin edits show up.
   */
  pick: {
    <V>(cmsValue: V | null | undefined, translationValue: V): V;
    <V>(cmsValue: V | null | undefined, translationValue: V | undefined): V | undefined;
  };
}

const noopPick = (<V,>(cms: V | null | undefined, tr: V | undefined): V | undefined =>
  (cms ?? tr) as V | undefined) as LanguageContextType["pick"];

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
  pick: noopPick,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("ml-lang") as Language | null;
    if (stored === "en" || stored === "gr") setLangState(stored);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("ml-lang", newLang);
  };

  const pick = (<V,>(cmsValue: V | null | undefined, translationValue: V | undefined): V | undefined => {
    if (lang === "gr") {
      // Greek: translation wins. Fall back to CMS only if translation is empty.
      return (translationValue ?? cmsValue) as V | undefined;
    }
    // English: CMS wins (admin edits should show). Fall back to translation.
    return (cmsValue ?? translationValue) as V | undefined;
  }) as LanguageContextType["pick"];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], pick }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
