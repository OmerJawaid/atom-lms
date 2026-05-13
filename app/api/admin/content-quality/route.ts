import { NextResponse } from "next/server";
import { getContentQualityIssues } from "@/lib/services/content-quality.service";

export async function GET() {
  try {
    const issues = await getContentQualityIssues();
    return NextResponse.json({ success: true, issues });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load quality issues" }, { status: 500 });
  }
}
