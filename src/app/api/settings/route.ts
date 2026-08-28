import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/settings";
import { settingsSchema } from "@/lib/validation";

export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const settings = await updateSettings(parsed.data);
  return NextResponse.json({ settings });
}
