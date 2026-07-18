import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        "bg-secondary": "var(--color-bg-secondary)",
        card: "var(--color-card)",
        text: "var(--color-text)",
        "text-secondary": "var(--color-text-secondary)",
        muted: "var(--color-text-muted)",
        brand: "var(--color-brand)",
        "brand-secondary": "var(--color-brand-secondary)",
        accent: "var(--color-accent)",
        "accent-2": "var(--color-accent-2)",
        border: "var(--color-border)",
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "serif"],
        display: ["var(--font-cinzel)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        warm: "0px 20px 60px rgba(90, 57, 38, 0.12)",
        "warm-sm": "0px 8px 24px rgba(90, 57, 38, 0.08)",
      },
      letterSpacing: {
        widest2: "0.2em",
      },
      maxWidth: {
        content: "1440px",
      },
      transitionTimingFunction: {
        reverent: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
