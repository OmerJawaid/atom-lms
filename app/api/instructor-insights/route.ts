import { NextResponse } from "next/server";
import { getInstructorInsights } from "@/lib/controllers/instructor.controller";

export async function GET() {
  try {
    const result = await getInstructorInsights();
    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to load instructor insights", fallbackUsed: true },
      { status: 500 }
    );
  }
}
