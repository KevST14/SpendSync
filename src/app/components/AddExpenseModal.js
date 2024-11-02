// src/app/components/AddExpenseModal.js
"use client";

import { useState } from 'react';

export default function AddExpenseModal({ onClose, onSave }) {
  const [expense, setExpense] = useState({ date: "", category: "", amount: "", notes: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(expense); // Call the onSave function to add the expense
    onClose(); // Close the modal after saving
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-surface p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            name="date"
            value={expense.date}
            onChange={handleChange}
            required
            className="mb-3 p-2 w-full rounded bg-background text-text-primary"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={expense.category}
            onChange={handleChange}
            required
            className="mb-3 p-2 w-full rounded bg-background text-text-primary"
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={expense.amount}
            onChange={handleChange}
            required
            className="mb-3 p-2 w-full rounded bg-background text-text-primary"
          />
          <input
            type="text"
            name="notes"
            placeholder="Notes"
            value={expense.notes}
            onChange={handleChange}
            className="mb-4 p-2 w-full rounded bg-background text-text-primary"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
