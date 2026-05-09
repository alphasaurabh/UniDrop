"use client";

import { motion, type MotionProps } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type FadeInProps = HTMLAttributes<HTMLDivElement> &
  MotionProps & {
    children: ReactNode;
    delay?: number;
  };

export function FadeIn({ children, className, delay = 0, ...props }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
