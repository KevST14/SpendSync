import { prisma } from "./prisma";
import type { SettingsInput } from "./validation";

const SETTINGS_ID = "app";

export interface Settings {
  displayName: string;
}

const DEFAULTS: Settings = { displayName: "John Doe" };

export async function getSettings(): Promise<Settings> {
  const row = await prisma.settings.findUnique({ where: { id: SETTINGS_ID } });
  return row ? { displayName: row.displayName } : DEFAULTS;
}

export async function updateSettings(input: SettingsInput): Promise<Settings> {
  const row = await prisma.settings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, displayName: input.displayName },
    update: { displayName: input.displayName },
  });
  return { displayName: row.displayName };
}

/** "John Doe" -> "JD" */
export function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}
