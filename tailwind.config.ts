import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface-color)",
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        accent: "var(--accent-color)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        success: "var(--success-color)",
        warning: "var(--warning-color)",
        danger: "var(--danger-color)",
      },
      boxShadow: {
        custom: "0 10px 20px rgba(0, 0, 0, 0.2)",
        glow: "0 0 15px rgba(0, 255, 240, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
