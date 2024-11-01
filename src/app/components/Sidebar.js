// app/components/Sidebar.js
"use client";

import { useState } from "react";

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");

  const handleNavigation = (section) => {
    setActive(section);
    // Add actual navigation logic if needed
  };

  return (
    <aside className="w-64 h-screen bg-surface p-5 shadow-lg flex flex-col">
      <div className="mb-10">
        <h2 className="text-primary text-2xl font-bold mb-2">SpendSync</h2>
        <p className="text-secondary">Personal Finance Tracker</p>
      </div>
      <nav className="flex flex-col space-y-4">
        <button 
          onClick={() => handleNavigation("Dashboard")}
          className={`text-textSecondary text-lg font-medium py-2 px-3 rounded-lg transition-colors ${
            active === "Dashboard" ? "bg-primary text-textPrimary" : "hover:bg-surface-color"
          }`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => handleNavigation("Transactions")}
          className={`text-textSecondary text-lg font-medium py-2 px-3 rounded-lg transition-colors ${
            active === "Transactions" ? "bg-primary text-textPrimary" : "hover:bg-surface-color"
          }`}
        >
          Transactions
        </button>
        <button 
          onClick={() => handleNavigation("Reports")}
          className={`text-textSecondary text-lg font-medium py-2 px-3 rounded-lg transition-colors ${
            active === "Reports" ? "bg-primary text-textPrimary" : "hover:bg-surface-color"
          }`}
        >
          Reports
        </button>
        <button 
          onClick={() => handleNavigation("Settings")}
          className={`text-textSecondary text-lg font-medium py-2 px-3 rounded-lg transition-colors ${
            active === "Settings" ? "bg-primary text-textPrimary" : "hover:bg-surface-color"
          }`}
        >
          Settings
        </button>
      </nav>
    </aside>
  );
}
