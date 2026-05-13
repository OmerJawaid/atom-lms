import { NextResponse } from "next/server";
import { getFullPlatformHealth } from "@/lib/services/platform-health.service";

export async function GET() {
  try {
    const health = await getFullPlatformHealth();
    return NextResponse.json({ success: true, health });
  } catch {
    return NextResponse.json({ success: false, error: "Health check failed" }, { status: 500 });
  }
}
