import { NextResponse } from "next/server";
import { getAdminAnalytics } from "@/lib/controllers/admin.controller";

export async function GET() {
  try {
    const result = await getAdminAnalytics();
    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to load admin analytics", fallbackUsed: true },
      { status: 500 }
    );
  }
}
