"use client";

import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

type Theme = "light" | "dark";

function systemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    let stored: Theme | null = null;
    try {
      const value = localStorage.getItem("theme");
      if (value === "light" || value === "dark") stored = value;
    } catch {
      /* ignore */
    }
    setTheme(stored ?? systemTheme());
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle colour theme"
      className="mt-auto flex items-center gap-3 rounded-lg border border-border px-4 py-2.5 text-sm text-muted transition-colors hover:bg-elevated hover:text-heading"
    >
      {theme === "light" ? <FaMoon /> : <FaSun />}
      <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}
