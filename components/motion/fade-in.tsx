"use client";

import { motion, type MotionProps, type Transition } from "framer-motion";
import { useEffect, useState, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type FadeInProps = HTMLAttributes<HTMLDivElement> &
  MotionProps & {
    children: ReactNode;
    delay?: number;
  };

export function FadeIn({ children, className, delay = 0, ...props }: FadeInProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Detect mobile
    setIsMobile(window.innerWidth <= 768);

    // Detect prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // On mobile or reduced motion, use simpler animation
  const initialProps = prefersReducedMotion
    ? { opacity: 0 }
    : isMobile
      ? { opacity: 0, y: 12, scale: 0.98 }
      : { opacity: 0, y: 24, scale: 0.985 };

  const animateProps = { opacity: 1, y: 0, scale: 1 };

  const transitionProps: Transition = prefersReducedMotion
    ? { duration: 0.1, delay: 0 }
    : isMobile
      ? { duration: 0.4, delay, ease: "easeOut" }
      : { duration: 0.7, delay, ease: "easeOut" };

  return (
    <motion.div
      initial={initialProps}
      whileInView={animateProps}
      viewport={{ once: true, margin: "-80px" }}
      transition={transitionProps}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
