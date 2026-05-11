"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  showLabel?: boolean;
};

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = useMemo(() => {
    if (!mounted) {
      return false;
    }

    if (theme === "system") {
      return resolvedTheme === "dark";
    }

    return theme === "dark";
  }, [mounted, resolvedTheme, theme]);

  const nextThemeLabel = isDark ? "Light" : "Dark";

  function handleToggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={handleToggleTheme}
      className={cn(
        "group inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/75 px-3 py-2 text-sm font-medium shadow-soft backdrop-blur-xl",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated hover:border-primary/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      title={mounted ? `Switch to ${nextThemeLabel} mode` : "Toggle theme"}
      aria-label={mounted ? `Switch to ${nextThemeLabel} mode` : "Toggle theme"}
    >
      <span className="relative flex size-8 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
        <Sun
          className={cn(
            "absolute size-4 transition-all duration-300",
            mounted && isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
          )}
        />
        <Moon
          className={cn(
            "absolute size-4 transition-all duration-300",
            mounted && isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
          )}
        />
      </span>
      {showLabel ? (
        <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors group-hover:text-foreground">
          {mounted ? nextThemeLabel : "Theme"}
        </span>
      ) : null}
    </button>
  );
}
