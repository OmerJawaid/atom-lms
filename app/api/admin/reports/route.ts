import { NextResponse } from "next/server";
import { getReports } from "@/lib/services/report.service";

export async function GET() {
  try {
    const reports = await getReports();
    return NextResponse.json({ success: true, reports });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load reports" }, { status: 500 });
  }
}
