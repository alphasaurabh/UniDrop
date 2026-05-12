import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
      boxShadow: {
        soft: "0 18px 55px -34px rgb(15 23 42 / 0.32)",
        glow: "0 0 0 1px rgb(255 255 255 / 0.9), 0 28px 70px -38px rgb(15 23 42 / 0.42)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.375rem",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backdropFilter: {
        none: "none",
        sm: "blur(4px)",
        md: "blur(8px)",
        lg: "blur(12px)",
        xl: "blur(16px)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [
    // Mobile performance optimization plugin
    plugin(function ({ addUtilities, matchVariant, theme }) {
      // Add touch-optimized utilities
      addUtilities({
        ".touch-optimize": {
          "will-change": "transform",
          "-webkit-font-smoothing": "antialiased",
          "-moz-osx-font-smoothing": "grayscale",
        },
        ".gpu-accelerate": {
          transform: "translateZ(0)",
          "will-change": "transform",
        },
        ".reduce-motion": {
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none !important",
            transition: "none !important",
          },
        },
        ".mobile-blur-sm": {
          "@media (max-width: 768px)": {
            backdropFilter: "blur(6px) saturate(100%)",
            WebkitBackdropFilter: "blur(6px) saturate(100%)",
          },
        },
        ".mobile-blur-md": {
          "@media (max-width: 768px)": {
            backdropFilter: "blur(8px) saturate(110%)",
            WebkitBackdropFilter: "blur(8px) saturate(110%)",
          },
        },
        ".mobile-blur-lg": {
          "@media (max-width: 768px)": {
            backdropFilter: "blur(10px) saturate(110%)",
            WebkitBackdropFilter: "blur(10px) saturate(110%)",
          },
        },
        ".mobile-shadow-sm": {
          "@media (max-width: 768px)": {
            boxShadow: "0 4px 8px rgba(15, 23, 42, 0.08)",
          },
        },
        ".mobile-shadow-md": {
          "@media (max-width: 768px)": {
            boxShadow: "0 8px 16px rgba(15, 23, 42, 0.08)",
          },
        },
        ".mobile-tap-scale": {
          "@apply transition-transform active:scale-95": {},
          "@media (max-width: 768px)": {
            "@apply active:scale-97": {},
          },
        },
        ".prevent-scroll-bounce": {
          "@media (max-width: 768px)": {
            overscrollBehavior: "contain",
          },
        },
      });

      // Add responsive variant for sm screens
      matchVariant(
        "mobile",
        (value) => `@media (max-width: ${value})`,
        {
          values: {
            xs: "480px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
          },
        }
      );
    }),
  ],
};

export default config;
