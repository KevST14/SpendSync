"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaBullseye,
  FaChartPie,
  FaCog,
  FaMoon,
  FaPiggyBank,
  FaPlus,
  FaSyncAlt,
  FaTachometerAlt,
  FaWallet,
} from "react-icons/fa";
import type { IconType } from "react-icons";

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: IconType;
  run: (router: ReturnType<typeof useRouter>) => void;
}

function toggleTheme() {
  const root = document.documentElement;
  const current =
    root.getAttribute("data-theme") ??
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const next = current === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* ignore */
  }
}

const COMMANDS: Command[] = [
  {
    id: "nav-overview",
    label: "Overview",
    hint: "Go to",
    icon: FaTachometerAlt,
    run: (r) => r.push("/"),
  },
  {
    id: "nav-expenses",
    label: "Expenses",
    hint: "Go to",
    icon: FaWallet,
    run: (r) => r.push("/expenses"),
  },
  {
    id: "nav-income",
    label: "Income",
    hint: "Go to",
    icon: FaPiggyBank,
    run: (r) => r.push("/income"),
  },
  {
    id: "nav-budgets",
    label: "Budgets",
    hint: "Go to",
    icon: FaChartPie,
    run: (r) => r.push("/budgets"),
  },
  {
    id: "nav-goals",
    label: "Goals",
    hint: "Go to",
    icon: FaBullseye,
    run: (r) => r.push("/goals"),
  },
  {
    id: "nav-recurring",
    label: "Recurring",
    hint: "Go to",
    icon: FaSyncAlt,
    run: (r) => r.push("/recurring"),
  },
  {
    id: "nav-settings",
    label: "Settings",
    hint: "Go to",
    icon: FaCog,
    run: (r) => r.push("/settings"),
  },
  {
    id: "add-tx",
    label: "Add transaction",
    hint: "Action",
    icon: FaPlus,
    run: (r) => r.push("/expenses?add=1"),
  },
  {
    id: "toggle-theme",
    label: "Toggle theme",
    hint: "Action",
    icon: FaMoon,
    run: () => toggleTheme(),
  },
];

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  const choose = (command: Command | undefined) => {
    if (!command) return;
    close();
    command.run(router);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/50 p-4 pt-[12vh]"
      onClick={close}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              choose(results[active]);
            }
          }}
          placeholder="Type a command…"
          className="w-full border-b border-border bg-transparent px-4 py-3.5 text-heading placeholder:text-muted focus:outline-none"
        />
        <ul className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted">No commands</li>
          )}
          {results.map((command, i) => {
            const Icon = command.icon;
            return (
              <li key={command.id}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(command)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${
                    i === active ? "bg-elevated text-heading" : "text-muted"
                  }`}
                >
                  <Icon className="text-accent" />
                  <span className="flex-1 text-heading">{command.label}</span>
                  <span className="text-xs text-muted">{command.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
