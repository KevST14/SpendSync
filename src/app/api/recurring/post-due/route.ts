import { NextResponse } from "next/server";
import { postAllDue } from "@/lib/recurring";

export async function POST() {
  const posted = await postAllDue();
  return NextResponse.json({ posted });
}
