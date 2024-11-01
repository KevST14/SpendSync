// app/components/Sidebar.js
"use client";

import { useState } from "react";
import { FaTachometerAlt, FaWallet, FaChartPie, FaFileAlt, FaCog } from "react-icons/fa";

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");

  const handleNavigation = (section) => {
    setActive(section);
    // Add actual navigation logic if needed
  };

  return (
    <aside className="sidebar w-64 h-screen bg-surface p-6 shadow-lg flex flex-col">
      <div className="sidebar-header flex items-center mb-10">
        <img src="https://via.placeholder.com/50" alt="Logo" className="logo rounded-full shadow-md mr-3" />
        <h2 className="text-primary font-bold text-2xl">SpendSync</h2>
      </div>
      <ul className="nav-links flex flex-col gap-4">
        <li className={`nav-item ${active === "Dashboard" ? "active" : ""}`} onClick={() => handleNavigation("Dashboard")}>
          <FaTachometerAlt className="mr-3" /> Dashboard
        </li>
        <li className={`nav-item ${active === "Expenses" ? "active" : ""}`} onClick={() => handleNavigation("Expenses")}>
          <FaWallet className="mr-3" /> Expenses
        </li>
        <li className={`nav-item ${active === "Budgets" ? "active" : ""}`} onClick={() => handleNavigation("Budgets")}>
          <FaChartPie className="mr-3" /> Budgets
        </li>
        <li className={`nav-item ${active === "Reports" ? "active" : ""}`} onClick={() => handleNavigation("Reports")}>
          <FaFileAlt className="mr-3" /> Reports
        </li>
        <li className={`nav-item ${active === "Settings" ? "active" : ""}`} onClick={() => handleNavigation("Settings")}>
          <FaCog className="mr-3" /> Settings
        </li>
      </ul>
    </aside>
  );
}
