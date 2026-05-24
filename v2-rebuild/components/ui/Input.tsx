import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-900",
        "placeholder:text-ink-400",
        "focus:outline-none focus:ring-2 focus:ring-ink-900 focus:border-ink-900",
        "disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900",
        "placeholder:text-ink-400",
        "focus:outline-none focus:ring-2 focus:ring-ink-900 focus:border-ink-900",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
