import GoalsManager from "@/app/components/GoalsManager";

export default function GoalsPage() {
  return (
    <div className="space-y-8">
      <header className="header rounded-lg bg-surface p-6 shadow-md">
        <h1 className="text-3xl font-semibold text-heading">Savings Goals</h1>
        <p className="mt-1 text-muted">Set a target and log contributions as you go.</p>
      </header>
      <GoalsManager />
    </div>
  );
}
