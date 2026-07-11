"use client";

import { cn } from "@/lib/utils";
import AnimatedSection from "./AnimatedSection";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  theme?: "dark" | "light";
  className?: string;
  titleClassName?: string;
  maxWidth?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  theme = "light",
  className,
  titleClassName,
  maxWidth = "max-w-3xl",
}: SectionHeaderProps) {
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[align];

  const isDark = theme === "dark";

  return (
    <div className={cn("flex flex-col gap-4", alignClass, className)}>
      {eyebrow && (
        <AnimatedSection delay={0.05}>
          <span
            className={cn(
              "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]",
              isDark ? "text-gold-400" : "text-navy-600"
            )}
          >
            <span
              className={cn(
                "w-5 h-px",
                isDark ? "bg-gold-400" : "bg-navy-500"
              )}
            />
            {eyebrow}
            <span
              className={cn(
                "w-5 h-px",
                isDark ? "bg-gold-400" : "bg-navy-500"
              )}
            />
          </span>
        </AnimatedSection>
      )}

      <AnimatedSection delay={0.1}>
        <h2
          className={cn(
            "font-display font-bold leading-[1.1] tracking-tight",
            "text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem]",
            isDark ? "text-white" : "text-navy-950",
            titleClassName
          )}
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          {title}
        </h2>
      </AnimatedSection>

      {subtitle && (
        <AnimatedSection delay={0.15}>
          <p
            className={cn(
              "text-base sm:text-lg leading-relaxed font-medium",
              align === "center" && maxWidth,
              align === "center" && "mx-auto",
              isDark ? "text-navy-200/70" : "text-navy-900/65"
            )}
          >
            {subtitle}
          </p>
        </AnimatedSection>
      )}
    </div>
  );
}
