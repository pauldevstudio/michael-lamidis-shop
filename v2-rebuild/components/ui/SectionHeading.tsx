import * as React from "react";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "max-w-content",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2
        className={cn(
          "font-heading text-[2rem] leading-[2.5rem] sm:text-[2.25rem] sm:leading-[2.625rem] md:text-[2.75rem] md:leading-[3.125rem] tracking-tight text-ink-900",
          eyebrow ? "mt-3" : ""
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-ink-500 max-w-prose mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
