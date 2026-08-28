// app/components/Header.js
"use client";

export default function Header() {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-primary">Welcome to SpendSync</h1>
        <p className="text-secondary">Your personal finance dashboard</p>
      </div>
      <button className="bg-primary text-white py-2 px-6 rounded-md shadow hover:bg-secondary transition-colors">
        Add New Transaction
      </button>
    </header>
  );
}
