import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "gold";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-ink-900 text-bone hover:bg-ink-800 active:bg-ink-700 shadow-card hover:shadow-card-hover",
  secondary:
    "bg-white text-ink-900 border border-ink-200 hover:border-ink-300 hover:bg-ink-50",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-50",
  outline:
    "bg-transparent border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-bone",
  gold:
    "bg-gold-400 text-ink-900 hover:bg-gold-500 hover:text-bone shadow-card hover:shadow-card-hover",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-md",
  md: "h-11 px-5 text-sm rounded-lg",
  lg: "h-12 px-6 text-base rounded-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2 focus-visible:ring-offset-bone",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
