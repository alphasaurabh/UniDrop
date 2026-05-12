import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-gradient-to-r from-muted/90 via-muted/70 to-muted/90 [animation-duration:1.4s]", className)}
      {...props}
    />
  );
}
