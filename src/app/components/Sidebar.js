// app/components/Sidebar.js
"use client";

import { useState } from "react";
import { FaTachometerAlt, FaWallet, FaPiggyBank, FaChartPie, FaCog } from "react-icons/fa";

export default function Sidebar() {
  const [active, setActive] = useState("Overview");

  const handleNavigation = (section) => {
    setActive(section);
  };

  return (
    <aside className="sidebar w-64 h-screen bg-surface p-6 shadow-lg flex flex-col">
      <div className="sidebar-header flex items-center mb-10">
        <img src="https://via.placeholder.com/50" alt="Logo" className="logo rounded-full shadow-md mr-3" />
        <h2 className="text-accent font-bold text-2xl">SpendSync</h2>
      </div>
      <ul className="nav-links flex flex-col gap-4">
        <li className={`nav-item ${active === "Overview" ? "active" : ""}`} onClick={() => handleNavigation("Overview")}>
          <FaTachometerAlt className="mr-3" /> Overview
        </li>
        <li className={`nav-item ${active === "Expenses" ? "active" : ""}`} onClick={() => handleNavigation("Expenses")}>
          <FaWallet className="mr-3" /> Expenses
        </li>
        <li className={`nav-item ${active === "Income" ? "active" : ""}`} onClick={() => handleNavigation("Income")}>
          <FaPiggyBank className="mr-3" /> Income
        </li>
        <li className={`nav-item ${active === "Budgets" ? "active" : ""}`} onClick={() => handleNavigation("Budgets")}>
          <FaChartPie className="mr-3" /> Budgets
        </li>
        <li className={`nav-item ${active === "Settings" ? "active" : ""}`} onClick={() => handleNavigation("Settings")}>
          <FaCog className="mr-3" /> Settings
        </li>
      </ul>
    </aside>
  );
}
