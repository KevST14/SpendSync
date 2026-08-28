import { FaArrowUp, FaCalendarAlt, FaRegCalendarCheck, FaTags } from "react-icons/fa";
import Chart from "@/app/components/Chart";
import { listExpenses } from "@/lib/expenses";
import { formatGBP } from "@/lib/format";
import { sum, sumByCategory, sumByMonth } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function IncomePage() {
  const all = await listExpenses();
  const income = all.filter((entry) => entry.type === "income");

  const total = sum(income);
  const thisMonthKey = new Date().toISOString().slice(0, 7);
  const thisMonth = sum(income.filter((entry) => entry.date.startsWith(thisMonthKey)));
  const byCategory = sumByCategory(income);
  const byMonth = sumByMonth(income).slice(-6);

  const cards = [
    { label: "Total Income", value: formatGBP(total), Icon: FaArrowUp },
    { label: "This Month", value: formatGBP(thisMonth), Icon: FaRegCalendarCheck },
    {
      label: "Top Source",
      value: byCategory[0]
        ? `${byCategory[0].label}: ${formatGBP(byCategory[0].value)}`
        : "—",
      Icon: FaTags,
    },
  ];

  return (
    <div className="space-y-8">
      <header className="header rounded-lg bg-surface p-6 shadow-lg">
        <h1 className="text-3xl font-semibold text-heading">Income</h1>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map(({ label, value, Icon }) => (
          <div key={label} className="stat-card rounded-lg bg-surface p-6 shadow-md">
            <Icon className="mb-2 text-2xl text-accent" />
            <h3 className="text-lg font-medium text-muted">{label}</h3>
            <p className="mt-2 text-3xl font-bold text-success">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="chart-card rounded-lg bg-surface p-6 shadow-md">
          <h3 className="mb-3 text-muted">Income Over Time</h3>
          <Chart
            kind="line"
            labels={byMonth.map((m) => m.month)}
            values={byMonth.map((m) => m.value)}
            seriesLabel="Income"
            color="#14e0a0"
          />
        </div>
        <div className="chart-card rounded-lg bg-surface p-6 shadow-md">
          <h3 className="mb-3 text-muted">Income by Source</h3>
          {byCategory.length ? (
            <Chart
              kind="doughnut"
              labels={byCategory.map((c) => c.label)}
              values={byCategory.map((c) => c.value)}
            />
          ) : (
            <p className="text-muted">No income recorded yet.</p>
          )}
        </div>
      </section>

      <section className="rounded-lg bg-surface p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-heading">Income Entries</h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full min-w-[32rem] border-collapse text-left">
            <thead>
              <tr className="bg-brand text-white">
                <th className="border-b border-border p-3">Date</th>
                <th className="border-b border-border p-3">Source</th>
                <th className="border-b border-border p-3">Amount</th>
                <th className="border-b border-border p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {income.length === 0 && (
                <tr>
                  <td className="p-3 text-center text-muted" colSpan={4}>
                    No income recorded yet. Add one from the Expenses page.
                  </td>
                </tr>
              )}
              {income.map((entry) => (
                <tr key={entry.id} className="transition-colors hover:bg-elevated">
                  <td className="flex items-center border-b border-border p-3">
                    <FaCalendarAlt className="mr-2 text-muted" /> {entry.date}
                  </td>
                  <td className="border-b border-border p-3">{entry.category}</td>
                  <td className="border-b border-border p-3 font-semibold text-success">
                    + {formatGBP(entry.amount)}
                  </td>
                  <td className="border-b border-border p-3">{entry.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
