import { NextResponse } from "next/server";
import { generateAdminInsights } from "@/lib/services/gemini.service";
import { DEMO_METRICS, DEMO_COHORT_PERFORMANCE } from "@/lib/data/demoAdmin";
import { getContentQualityIssues } from "@/lib/services/content-quality.service";

export async function GET() {
  try {
    const qualityIssues = await getContentQualityIssues();
    const insights = await generateAdminInsights({
      totalLearners: DEMO_METRICS.totalLearners,
      averageCompletion: DEMO_METRICS.averageCompletion,
      averageQuizScore: DEMO_METRICS.averageQuizScore,
      highRiskLearners: DEMO_METRICS.highRiskLearners,
      mostRecommendedProgram: DEMO_METRICS.mostRecommendedProgram,
      mostDifficultTopic: DEMO_METRICS.mostDifficultTopic,
      cohortPerformance: DEMO_COHORT_PERFORMANCE.map((c) => ({ name: c.name, averageCompletion: c.averageCompletion, riskCount: c.riskCount })),
      contentQualityIssues: qualityIssues.map((i) => ({ courseName: i.courseName, issueType: i.issueType, qualityScore: i.qualityScore })),
    });
    return NextResponse.json({ success: true, ...insights });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to generate insights" }, { status: 500 });
  }
}
