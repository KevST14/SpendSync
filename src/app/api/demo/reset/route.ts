import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetDemoData } from "@/lib/demo";

// Wipes all data and reloads the demo dataset. Intentional for the showcase.
export async function POST() {
  await resetDemoData(prisma);
  return NextResponse.json({ ok: true });
}
