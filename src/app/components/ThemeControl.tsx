"use client";

import { useEffect, useState } from "react";

type Choice = "system" | "light" | "dark";
const options: Choice[] = ["system", "light", "dark"];

function apply(choice: Choice) {
  const root = document.documentElement;
  if (choice === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", choice);
  try {
    if (choice === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", choice);
  } catch {
    /* ignore */
  }
}

export default function ThemeControl() {
  const [choice, setChoice] = useState<Choice>("system");

  useEffect(() => {
    try {
      const value = localStorage.getItem("theme");
      if (value === "light" || value === "dark") setChoice(value);
    } catch {
      /* ignore */
    }
  }, []);

  const pick = (next: Choice) => {
    setChoice(next);
    apply(next);
  };

  return (
    <div className="inline-flex rounded-lg border border-border p-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => pick(option)}
          aria-pressed={choice === option}
          className={`rounded-md px-4 py-1.5 text-sm capitalize transition-colors ${
            choice === option ? "bg-brand text-white" : "text-muted hover:text-heading"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
