"use client";

import { useLanguage } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  theme?: "dark" | "light";
  className?: string;
}

export default function LanguageSwitcher({
  theme = "dark",
  className,
}: LanguageSwitcherProps) {
  const { lang, setLang, t } = useLanguage();

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setLang(lang === "en" ? "gr" : "en")}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase",
        "transition-all duration-200 border focus-ring",
        isDark
          ? "border-white/15 text-white/70 hover:text-white hover:border-white/30 hover:bg-white/8"
          : "border-navy-200 text-navy-500 hover:text-navy-900 hover:border-navy-300 hover:bg-navy-50",
        className
      )}
    >
      <span className="text-base leading-none" aria-hidden="true">{lang === "en" ? "🇬🇷" : "🇬🇧"}</span>
      {t.nav.switchLang}
    </button>
  );
}
