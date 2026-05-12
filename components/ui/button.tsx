import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "glass-btn bg-primary text-primary-foreground shadow-soft md:hover:-translate-y-0.5 focus-visible:ring-primary",
  secondary:
    "glass-btn bg-card/85 text-foreground shadow-soft md:hover:-translate-y-0.5 focus-visible:ring-foreground/40",
  ghost: "bg-transparent text-foreground hover:bg-muted/70 focus-visible:ring-primary",
  outline:
    "border border-border/70 bg-card/70 text-foreground shadow-soft backdrop-blur-lg md:backdrop-blur-xl md:hover:-translate-y-0.5 hover:bg-card focus-visible:ring-primary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 px-3 text-sm",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2.5 px-5 text-base",
};

type BaseButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type NativeButtonProps = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: false;
  };

type LinkButtonProps = BaseButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    asChild: true;
    href: string;
  };

export type ButtonProps = NativeButtonProps | LinkButtonProps;

export function Button({
  asChild,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center rounded-xl font-medium transition will-change-transform",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "touch-optimize reduce-motion",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (asChild) {
    const { href, ...linkProps } = props as LinkButtonProps;

    return (
      <Link className={classes} href={href} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as NativeButtonProps)}>
      {children}
    </button>
  );
}
