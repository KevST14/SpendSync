"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  FaBars,
  FaBullseye,
  FaChartPie,
  FaCog,
  FaPiggyBank,
  FaSyncAlt,
  FaTachometerAlt,
  FaWallet,
} from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

interface NavItem {
  label: string;
  href: string;
  icon: IconType;
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/", icon: FaTachometerAlt },
  { label: "Expenses", href: "/expenses", icon: FaWallet },
  { label: "Income", href: "/income", icon: FaPiggyBank },
  { label: "Budgets", href: "/budgets", icon: FaChartPie },
  { label: "Goals", href: "/goals", icon: FaBullseye },
  { label: "Recurring", href: "/recurring", icon: FaSyncAlt },
  { label: "Settings", href: "/settings", icon: FaCog },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {!open && (
        <button
          type="button"
          className="sidebar-toggle"
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
        >
          <FaBars />
        </button>
      )}

      <div
        className={`sidebar-backdrop ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo" aria-hidden="true">
            S
          </span>
          <h2 className="text-2xl font-bold text-accent">SpendSync</h2>
        </div>

        <nav>
          <ul className="nav-links">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`nav-item ${active ? "active" : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon aria-hidden="true" /> {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <ThemeToggle />
      </aside>
    </>
  );
}
