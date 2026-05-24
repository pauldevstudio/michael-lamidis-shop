import * as React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof React.JSX.IntrinsicElements;
  width?: "default" | "narrow" | "wide";
}

const widths: Record<NonNullable<Props["width"]>, string> = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

export function Container({ as: Tag = "div", className, width = "default", ...props }: Props) {
  const Component = Tag as React.ElementType;
  return (
    <Component
      className={cn("mx-auto w-full px-5 sm:px-6 lg:px-8", widths[width], className)}
      {...props}
    />
  );
}
