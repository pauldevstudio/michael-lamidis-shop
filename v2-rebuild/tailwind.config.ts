import type { Config } from "tailwindcss";

/**
 * Design tokens:
 *  - 3 colors: ink (text/primary), bone (background), gold (accent)
 *  - 8px spacing grid (Tailwind default already 4px; we use multiples of 2)
 *  - Type scale 14/16/20/28/36/48 mapped to text-sm/base/lg/2xl/3xl/5xl
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0f1c",
          900: "#0a0f1c",
          800: "#111827",
          700: "#1f2937",
          600: "#374151",
          500: "#4b5563",
          400: "#6b7280",
          300: "#9ca3af",
          200: "#d1d5db",
          100: "#e5e7eb",
          50: "#f3f4f6",
        },
        bone: {
          DEFAULT: "#fafaf7",
          100: "#f5f4ef",
          200: "#ebe9e1",
        },
        gold: {
          DEFAULT: "#b08d57",
          50: "#faf6ef",
          100: "#f1e8d4",
          200: "#e2cfa3",
          300: "#cbac6f",
          400: "#b08d57",
          500: "#977545",
          600: "#7a5d36",
          700: "#5e4628",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "Inter", "sans-serif"],
      },
      fontSize: {
        // body
        sm: ["0.875rem", { lineHeight: "1.5rem", letterSpacing: "0" }],
        base: ["1rem", { lineHeight: "1.6rem", letterSpacing: "0" }],
        lg: ["1.25rem", { lineHeight: "1.875rem", letterSpacing: "-0.005em" }],
        // display
        "h4": ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em", fontWeight: "600" }],
        "h3": ["1.75rem", { lineHeight: "2.125rem", letterSpacing: "-0.015em", fontWeight: "700" }],
        "h2": ["2.25rem", { lineHeight: "2.625rem", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h1": ["3rem", { lineHeight: "3.375rem", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display": ["3.75rem", { lineHeight: "4rem", letterSpacing: "-0.03em", fontWeight: "700" }],
      },
      spacing: {
        // section rhythm: 80–120px
        "section-y": "5rem",
        "section-y-lg": "7.5rem",
      },
      maxWidth: {
        prose: "42rem",
        content: "44rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(10 15 28 / 0.04), 0 1px 3px 0 rgb(10 15 28 / 0.06)",
        "card-hover": "0 8px 24px -8px rgb(10 15 28 / 0.12), 0 4px 8px -4px rgb(10 15 28 / 0.08)",
        elevated: "0 24px 48px -24px rgb(10 15 28 / 0.22), 0 8px 16px -8px rgb(10 15 28 / 0.10)",
      },
      backgroundImage: {
        "gradient-hero": "radial-gradient(ellipse 80% 60% at 50% -10%, #f1e8d4 0%, #fafaf7 60%)",
        "gradient-ink": "linear-gradient(135deg, #0a0f1c 0%, #1f2937 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
