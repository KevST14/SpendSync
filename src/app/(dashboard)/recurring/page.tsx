import RecurringManager from "@/app/components/RecurringManager";

export default function RecurringPage() {
  return (
    <div className="space-y-8">
      <header className="header rounded-lg bg-surface p-6 shadow-md">
        <h1 className="text-3xl font-semibold text-heading">Recurring</h1>
        <p className="mt-1 text-muted">
          Rules that post a transaction on a schedule. Use “Post due” to catch up.
        </p>
      </header>
      <RecurringManager />
    </div>
  );
}
