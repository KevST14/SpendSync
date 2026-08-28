import SettingsForm from "@/app/components/SettingsForm";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { displayName } = await getSettings();

  return (
    <div className="space-y-8">
      <header className="header rounded-lg bg-surface p-6 shadow-md">
        <h1 className="text-3xl font-semibold text-heading">Settings</h1>
      </header>
      <SettingsForm initialName={displayName} />
    </div>
  );
}
