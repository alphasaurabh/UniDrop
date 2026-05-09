import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "soft" | "dark";
};

const variants = {
  default: "border-white/60 bg-white/85 text-foreground shadow-sm backdrop-blur",
  soft: "border-emerald-200/70 bg-emerald-50/90 text-emerald-800",
  dark: "border-foreground/10 bg-foreground text-background",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
