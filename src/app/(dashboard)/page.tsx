import {
  FaArrowUp,
  FaArrowDown,
  FaBalanceScale,
  FaReceipt,
  FaCalendarAlt,
} from "react-icons/fa";
import Chart from "@/app/components/Chart";
import { listExpenses } from "@/lib/expenses";
import { computeStats } from "@/lib/stats";
import { formatGBP } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const expenses = await listExpenses();
  const stats = computeStats(expenses);

  const monthLabels = stats.monthly.map((m) => m.month);
  const incomeSeries = stats.monthly.map((m) => m.income);
  const expenseSeries = stats.monthly.map((m) => m.expense);

  const cards = [
    {
      label: "Total Income",
      value: formatGBP(stats.totalIncome),
      color: "text-success",
      Icon: FaArrowUp,
    },
    {
      label: "Total Expenses",
      value: formatGBP(stats.totalExpense),
      color: "text-danger",
      Icon: FaArrowDown,
    },
    {
      label: "Net Balance",
      value: formatGBP(stats.net),
      color: stats.net >= 0 ? "text-success" : "text-danger",
      Icon: FaBalanceScale,
    },
    {
      label: "Transactions",
      value: String(stats.transactionCount),
      color: "text-accent",
      Icon: FaReceipt,
    },
  ];

  return (
    <div className="space-y-8">
      <header className="header flex items-center justify-between rounded-lg bg-surface p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Personal Finance Dashboard</h1>
        <div className="user-info flex items-center gap-3">
          <span className="avatar" aria-hidden="true">
            JD
          </span>
          <span>John Doe</span>
        </div>
      </header>

      <h2 className="mb-4 text-xl font-bold">Dashboard Overview</h2>
      <div className="stats-grid mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, color, Icon }) => (
          <div key={label} className="stat-card glow rounded-lg bg-surface p-6 shadow-md">
            <Icon className="mb-2 text-2xl text-accent" />
            <h3>{label}</h3>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="charts-container mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="chart-card rounded-lg bg-surface p-6 shadow-md">
          <h3 className="mb-3 text-muted">Expenses by Category</h3>
          {stats.byCategory.length ? (
            <Chart
              kind="doughnut"
              labels={stats.byCategory.map((c) => c.label)}
              values={stats.byCategory.map((c) => c.value)}
            />
          ) : (
            <p className="text-muted">No expense data yet.</p>
          )}
        </div>
        <div className="chart-card rounded-lg bg-surface p-6 shadow-md">
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
        <div className="chart-card rounded-lg bg-surface p-6 shadow-md">
          <h3 className="mb-3 text-muted">Income Over Time</h3>
          <Chart
            kind="line"
            labels={monthLabels}
            values={incomeSeries}
            seriesLabel="Income"
            color="#14e0a0"
          />
        </div>
        <div className="chart-card rounded-lg bg-surface p-6 shadow-md">
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

      <h2 className="mb-4 text-xl font-bold">Recent Transactions</h2>
      <div className="rounded-lg bg-surface p-6 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] overflow-hidden rounded-lg text-left">
            <thead className="bg-brand text-heading">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-surface">
              {stats.recent.length === 0 && (
                <tr>
                  <td className="p-3 text-center text-muted" colSpan={4}>
                    No transactions yet.
                  </td>
                </tr>
              )}
              {stats.recent.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-elevated">
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
                  <td className="p-3">{t.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
