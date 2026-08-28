import type { ReactNode } from "react";
import CommandPalette from "@/app/components/CommandPalette";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import { ToastProvider } from "@/app/components/Toast";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { displayName } = await getSettings();

  return (
    <ToastProvider>
      <CommandPalette />
      <div className="app-shell">
        <Sidebar />
        <div className="app-main">
          <Topbar name={displayName} />
          <main className="main-content">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
