"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  FaTachometerAlt,
  FaWallet,
  FaPiggyBank,
  FaChartPie,
  FaCog,
} from "react-icons/fa";

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
  { label: "Settings", href: "/settings", icon: FaCog },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
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
                  <Icon className="mr-3" aria-hidden="true" /> {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
