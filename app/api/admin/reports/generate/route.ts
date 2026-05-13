import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "@/lib/services/report.service";
import { ReportType } from "@/lib/models/report.model";

const VALID_TYPES: ReportType[] = [
  "course_performance", "learner_progress", "cohort_summary",
  "instructor_performance", "quiz_performance", "ai_recommendation_summary", "content_quality",
];

export async function POST(req: NextRequest) {
  try {
    const { reportType, dateRange } = await req.json();
    if (!VALID_TYPES.includes(reportType)) {
      return NextResponse.json({ success: false, error: "Invalid report type" }, { status: 400 });
    }
    const report = await generateReport(reportType as ReportType, dateRange);
    return NextResponse.json({ success: true, report });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to generate report" }, { status: 500 });
  }
}
