import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container max-w-7xl", className)} {...props} />;
}
