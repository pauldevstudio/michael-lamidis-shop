import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      colors: {
        navy: {
          50: "#EEF0FA",
          100: "#CDD2F0",
          200: "#9AAAE3",
          300: "#6882D6",
          400: "#3D62CC",
          500: "#1E48B8",
          600: "#163A96",
          700: "#0F2D75",
          800: "#091F52",
          900: "#060F2A",
          950: "#030813",
        },
        gold: {
          50:  "#EBF4FB",
          100: "#C5DFEF",
          200: "#A5C9EA",
          300: "#7FAEDB",
          400: "#5B82A8",
          500: "#3A5F8A",
          600: "#2F4F70",
          700: "#1E3347",
          800: "#111E2E",
          900: "#070D16",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-dark": "linear-gradient(135deg, #030813 0%, #060F2A 40%, #091F52 100%)",
        "gold-shine": "linear-gradient(135deg, #3A5F8A 0%, #7FAEDB 50%, #3A5F8A 100%)",
        "glass-card": "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
      },
      animation: {
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "float-slow-d": "floatSlow 8s ease-in-out 3s infinite",
        "pulse-ring": "pulseRing 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "counter": "counter 2s ease-out forwards",
        "gradient-x": "gradientX 8s ease infinite",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-18px) rotate(1deg)" },
          "66%": { transform: "translateY(-8px) rotate(-1deg)" },
        },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.7" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      boxShadow: {
        "glow-blue": "0 0 60px rgba(30, 72, 184, 0.35)",
        "glow-gold": "0 0 60px rgba(58, 95, 138, 0.45)",
        "card-lift": "0 20px 60px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)",
        "card-dark": "0 20px 60px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
        "nav": "0 1px 0 rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.05)",
        "nav-dark": "0 1px 0 rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.4)",
      },
      screens: {
        xs: "475px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "112": "28rem",
        "128": "32rem",
      },
    },
  },
  plugins: [],
};

export default config;
