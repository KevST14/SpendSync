import BudgetManager from "@/app/components/BudgetManager";
import { listBudgets } from "@/lib/budgets";
import { listExpenses } from "@/lib/expenses";
import { sumByCategory } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function BudgetsPage() {
  const [budgets, expenses] = await Promise.all([listBudgets(), listExpenses()]);

  const monthKey = new Date().toISOString().slice(0, 7);
  const spend = sumByCategory(
    expenses.filter(
      (entry) => entry.type !== "income" && entry.date.startsWith(monthKey),
    ),
  );
  const spendByCategory: Record<string, number> = {};
  for (const slice of spend) spendByCategory[slice.label] = slice.value;

  const knownCategories = [
    ...new Set(expenses.filter((e) => e.type !== "income").map((e) => e.category)),
  ].sort();

  const monthName = new Date().toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      <header className="header rounded-lg bg-surface p-6 shadow-lg">
        <h1 className="text-3xl font-semibold text-heading">Budgets</h1>
        <p className="mt-1 text-muted">Monthly limits vs. actual spend for {monthName}</p>
      </header>

      <BudgetManager
        budgets={budgets}
        spendByCategory={spendByCategory}
        knownCategories={knownCategories}
      />
    </div>
  );
}
