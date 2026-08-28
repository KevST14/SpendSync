import {
  FaArrowUp,
  FaArrowDown,
  FaBalanceScale,
  FaReceipt,
  FaCalendarAlt,
  FaSyncAlt,
  FaBullseye,
} from "react-icons/fa";
import Chart from "@/app/components/Chart";
import Counter from "@/app/components/Counter";
import DateRangeTabs from "@/app/components/DateRangeTabs";
import { listExpenses } from "@/lib/expenses";
import { listRecurring } from "@/lib/recurring";
import { listGoals } from "@/lib/goals";
import { computeStats, isDateRange, rangeStart, type DateRange } from "@/lib/stats";
import { formatGBP } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeParam } = await searchParams;
  const range: DateRange = isDateRange(rangeParam) ? rangeParam : "6m";

  const [all, recurring, goals] = await Promise.all([
    listExpenses(),
    listRecurring(),
    listGoals(),
  ]);
  const start = rangeStart(range);
  const expenses = start ? all.filter((e) => e.date >= start) : all;
  const stats = computeStats(expenses);
  const upcoming = recurring.slice(0, 4);
  const topGoals = goals.slice(0, 3);

  const monthLabels = stats.monthly.map((m) => m.month);
  const incomeSeries = stats.monthly.map((m) => m.income);
  const expenseSeries = stats.monthly.map((m) => m.expense);

  const cards = [
    {
      label: "Total Income",
      amount: stats.totalIncome,
      variant: "currency" as const,
      color: "text-success",
      Icon: FaArrowUp,
    },
    {
      label: "Total Expenses",
      amount: stats.totalExpense,
      variant: "currency" as const,
      color: "text-danger",
      Icon: FaArrowDown,
    },
    {
      label: "Net Balance",
      amount: stats.net,
      variant: "currency" as const,
      color: stats.net >= 0 ? "text-success" : "text-danger",
      Icon: FaBalanceScale,
    },
    {
      label: "Transactions",
      amount: stats.transactionCount,
      variant: "count" as const,
      color: "text-accent",
      Icon: FaReceipt,
    },
  ];

  return (
    <div className="space-y-8">
      <header className="header flex flex-wrap items-center justify-between gap-4 rounded-lg bg-surface p-6 shadow-md">
        <h1 className="text-3xl font-semibold text-heading">
          Personal Finance Dashboard
        </h1>
        <DateRangeTabs current={range} />
      </header>

      <div className="stats-grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, amount, variant, color, Icon }, i) => (
          <div
            key={label}
            className="stat-card glow fade-up rounded-lg bg-surface p-6"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <Icon className="mb-2 text-2xl text-accent" />
            <h3 className="text-muted">{label}</h3>
            <p className={`text-3xl font-bold ${color}`}>
              <Counter value={amount} variant={variant} />
            </p>
          </div>
        ))}
      </div>

      <div className="charts-container grid grid-cols-1 gap-6 md:grid-cols-2">
        <div
          className="chart-card fade-up rounded-lg bg-surface p-6"
          style={{ animationDelay: "80ms" }}
        >
          <h3 className="mb-3 text-muted">Expenses by Category</h3>
          {stats.byCategory.length ? (
            <Chart
              kind="doughnut"
              labels={stats.byCategory.map((c) => c.label)}
              values={stats.byCategory.map((c) => c.value)}
            />
          ) : (
            <p className="text-muted">No expenses in this range.</p>
          )}
        </div>
        <div
          className="chart-card fade-up rounded-lg bg-surface p-6"
          style={{ animationDelay: "140ms" }}
        >
          <h3 className="mb-3 text-muted">Income vs. Expenses</h3>
          <Chart
            kind="bar"
            labels={monthLabels}
            values={incomeSeries}
            seriesLabel="Income"
            color="#14e0a0"
            series2={{ label: "Expenses", values: expenseSeries, color: "#ff5a68" }}
          />
        </div>
        <div
          className="chart-card fade-up rounded-lg bg-surface p-6"
          style={{ animationDelay: "200ms" }}
        >
          <h3 className="mb-3 text-muted">Income Over Time</h3>
          <Chart
            kind="line"
            labels={monthLabels}
            values={incomeSeries}
            seriesLabel="Income"
            color="#14e0a0"
          />
        </div>
        <div
          className="chart-card fade-up rounded-lg bg-surface p-6"
          style={{ animationDelay: "260ms" }}
        >
          <h3 className="mb-3 text-muted">Expenses Over Time</h3>
          <Chart
            kind="line"
            labels={monthLabels}
            values={expenseSeries}
            seriesLabel="Expenses"
            color="#ff5a68"
          />
        </div>
      </div>

      {(upcoming.length > 0 || topGoals.length > 0) && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {upcoming.length > 0 && (
            <div className="rounded-lg bg-surface p-6 shadow-md">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <FaSyncAlt className="text-accent" /> Upcoming
              </h2>
              <ul className="divide-y divide-border">
                {upcoming.map((rule) => (
                  <li key={rule.id} className="flex items-center justify-between py-2.5">
                    <span>
                      <span className="font-medium">{rule.category}</span>
                      <span className="ml-2 text-sm text-muted">
                        {rule.nextDate} · {rule.frequency}
                      </span>
                    </span>
                    <span
                      className={`font-semibold ${
                        rule.type === "income" ? "text-success" : "text-danger"
                      }`}
                    >
                      {rule.type === "income" ? "+ " : "- "}
                      {formatGBP(rule.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {topGoals.length > 0 && (
            <div className="rounded-lg bg-surface p-6 shadow-md">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <FaBullseye className="text-accent" /> Savings goals
              </h2>
              <ul className="space-y-3">
                {topGoals.map((goal) => {
                  const pct = goal.target > 0 ? (goal.saved / goal.target) * 100 : 0;
                  return (
                    <li key={goal.id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium">{goal.name}</span>
                        <span className="text-muted">
                          {formatGBP(goal.saved)} / {formatGBP(goal.target)}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded bg-elevated">
                        <div
                          className={`h-full rounded ${
                            pct >= 100 ? "bg-success" : "bg-brand"
                          }`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg bg-surface p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] overflow-hidden rounded-lg text-left">
            <thead className="bg-brand text-white">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.length === 0 && (
                <tr>
                  <td className="p-3 text-center text-muted" colSpan={4}>
                    No transactions in this range.
                  </td>
                </tr>
              )}
              {stats.recent.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-border transition-colors hover:bg-elevated"
                >
                  <td className="flex items-center p-3">
                    <FaCalendarAlt className="mr-2 text-muted" /> {t.date}
                  </td>
                  <td className="p-3">{t.category}</td>
                  <td
                    className={`p-3 font-semibold ${
                      t.type === "income" ? "text-success" : "text-danger"
                    }`}
                  >
                    {t.type === "income" ? "+ " : "- "}
                    {formatGBP(t.amount)}
                  </td>
                  <td className="p-3 text-muted">{t.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
