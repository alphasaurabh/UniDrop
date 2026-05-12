import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "soft" | "dark";
};

const variants = {
  default: "bg-card/88 text-foreground border-border/70 px-3 py-1 text-xs font-medium",
  soft: "bg-primary/10 text-primary border-primary/15",
  dark: "bg-foreground text-background border border-foreground/10",
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
