"use client";

import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type FadeInProps = HTMLAttributes<HTMLDivElement> &
  {
    children: ReactNode;
    delay?: number;
  };

export function FadeIn({ children, className, delay = 0, ...props }: FadeInProps) {
  return (
    <div className={cn("motion-safe:animate-fade-in", className)} {...props}>
      {children}
    </div>
  );
}
