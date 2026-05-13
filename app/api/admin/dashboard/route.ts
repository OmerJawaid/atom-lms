import { NextResponse } from "next/server";
import { generateAdminInsights } from "@/lib/services/gemini.service";
import { DEMO_METRICS, DEMO_PROGRAM_PERFORMANCE, DEMO_COHORT_PERFORMANCE, DEMO_RISK_DISTRIBUTION, DEMO_PLATFORM_EVENTS } from "@/lib/data/demoAdmin";
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

    return NextResponse.json({
      success: true,
      metrics: DEMO_METRICS,
      programPerformance: DEMO_PROGRAM_PERFORMANCE,
      cohortPerformance: DEMO_COHORT_PERFORMANCE,
      riskDistribution: DEMO_RISK_DISTRIBUTION,
      recentEvents: DEMO_PLATFORM_EVENTS.slice(0, 5),
      aiInsights: insights,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load dashboard" }, { status: 500 });
  }
}
