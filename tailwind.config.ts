import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        surface: "var(--color-surface)",
        elevated: "var(--color-elevated)",
        border: "var(--color-border)",
        heading: "var(--color-heading)",
        muted: "var(--color-muted)",
        brand: {
          DEFAULT: "var(--color-brand)",
          soft: "var(--color-brand-soft)",
        },
        accent: "var(--color-accent)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      borderColor: {
        DEFAULT: "var(--color-border)",
      },
      ringColor: {
        DEFAULT: "var(--color-brand-soft)",
      },
    },
  },
  plugins: [],
};

export default config;
