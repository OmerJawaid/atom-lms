import { AdminReport, ReportType } from "@/lib/models/report.model";
import { DEMO_REPORTS } from "@/lib/data/demoAdmin";

async function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("demo_gemini")) return null;
  try {
    const { GoogleGenAI } = await import("@google/genai");
    return new GoogleGenAI({ apiKey });
  } catch { return null; }
}

const REPORT_TEMPLATES: Record<ReportType, (d: Record<string, unknown>) => Omit<AdminReport, "id" | "generatedAt" | "generatedBy">> = {
  course_performance: (d) => ({
    title: "Course Performance Report", reportType: "course_performance", dateRange: (d.dateRange as string) || "last_30_days",
    summary: "Data Analytics Bootcamp has the highest enrollment. SQL Foundations remains the weakest quiz at 58% average. Business Analytics Pro leads in pass rates at 86%.",
    keyMetrics: [{ label: "Total Programs", value: 5 }, { label: "Avg Completion", value: "62%" }, { label: "Avg Quiz Score", value: "67%" }, { label: "Top Program", value: "Business Analytics Pro" }],
    findings: ["SQL Joins causes 42% of quiz failures", "Business Analytics Pro has 86% pass rate", "Agentic AI has lowest completion at 42%"],
    recommendedActions: ["Add SQL Joins remedial lecture", "Create adaptive quiz sets for Neural Networks", "Assign extra mentor sessions to Agentic AI cohort"],
  }),
  learner_progress: (d) => ({
    title: "Learner Progress Report", reportType: "learner_progress", dateRange: (d.dateRange as string) || "current",
    summary: "15 learners are at high risk with quiz scores below 50%. Average career readiness is 61%. Learners who completed onboarding score 2.3x better.",
    keyMetrics: [{ label: "Total Learners", value: 120 }, { label: "High Risk", value: "15 (12%)" }, { label: "Avg Career Readiness", value: "61%" }, { label: "Completed Onboarding", value: "68%" }],
    findings: ["15 high-risk learners need immediate attention", "Backpropagation and SQL Joins are the most common weak topics", "Usman Malik has 0% progress in AWS module"],
    recommendedActions: ["Email 15 high-risk learners with targeted resources", "Schedule group revision for SQL and ML topics", "Flag zero-progress learners for instructor outreach"],
  }),
  cohort_summary: (d) => ({
    title: "Cohort Summary Report", reportType: "cohort_summary", dateRange: (d.dateRange as string) || "current",
    summary: "3 cohorts are currently active. AI/ML Weekend Cohort has the most at-risk learners (6 of 18). Data Analytics Spring Cohort is performing best.",
    keyMetrics: [{ label: "Active Cohorts", value: 3 }, { label: "Total Enrolled", value: 58 }, { label: "Avg Completion", value: "55%" }, { label: "High-Risk Learners", value: 15 }],
    findings: ["AI/ML Weekend Cohort has 33% at-risk rate", "Data Analytics Spring Cohort leads at 68% completion", "Agentic AI Fast Track needs curriculum pacing review"],
    recommendedActions: ["Add extra session for AI/ML Weekend Cohort", "Share best practices from Data Analytics Cohort", "Review Agentic AI pacing with Hamza Ali"],
  }),
  instructor_performance: (d) => ({
    title: "Instructor Performance Report", reportType: "instructor_performance", dateRange: (d.dateRange as string) || "last_30_days",
    summary: "All 4 instructors are active. Dr. Ayesha Malik leads with 92/100 rating and 74% avg learner score. Ahmed Raza shows strongest completion rates.",
    keyMetrics: [{ label: "Active Instructors", value: 4 }, { label: "Avg Rating", value: "88.75" }, { label: "Avg Learner Score", value: "70%" }, { label: "Avg Completion Rate", value: "75.5%" }],
    findings: ["Dr. Ayesha Malik has highest rating and learner score", "Ahmed Raza's cohort has best completion rate (78%)", "Hamza Ali's Agentic AI cohort shows high engagement despite low completion"],
    recommendedActions: ["Invite Dr. Ayesha Malik to mentor program", "Document Ahmed Raza's completion strategies", "Review Agentic AI curriculum structure with Hamza Ali"],
  }),
  quiz_performance: (d) => ({
    title: "Quiz Performance Report", reportType: "quiz_performance", dateRange: (d.dateRange as string) || "last_30_days",
    summary: "15 adaptive quizzes active. SQL Foundations has the lowest average at 58%. Python Data Analysis quiz shows the highest accuracy at 82%.",
    keyMetrics: [{ label: "Total Quizzes", value: 15 }, { label: "Avg Score", value: "67%" }, { label: "Pass Rate", value: "72%" }, { label: "Most Failed Topic", value: "SQL Joins" }],
    findings: ["SQL Foundations quiz: 58% avg — below 60% threshold", "Window Functions and Backpropagation are most failed subtopics", "Python quiz has highest pass rate at 88%"],
    recommendedActions: ["Add 5 SQL Joins practice questions to SQL Foundations quiz", "Create remedial quiz set for Backpropagation topic", "Flag Model Evaluation quiz questions Q4 and Q5 for review"],
  }),
  ai_recommendation_summary: (d) => ({
    title: "AI Recommendation Summary", reportType: "ai_recommendation_summary", dateRange: (d.dateRange as string) || "last_30_days",
    summary: "Data Analytics Bootcamp is the most recommended program (34% of learners). AI profiling has 94% completion rate from onboarding flow.",
    keyMetrics: [{ label: "AI Profiles Generated", value: 120 }, { label: "Top Recommended", value: "Data Analytics Bootcamp" }, { label: "Profile Completion", value: "94%" }, { label: "Avg Confidence Score", value: "67" }],
    findings: ["Data Analytics Bootcamp recommended to 41 of 120 learners", "Beginner learners (52%) are the largest skill-level segment", "Hands-on learners score 12% higher on first quiz attempt"],
    recommendedActions: ["Create beginner-friendly content variants for Data Analytics", "Optimize onboarding for 6% who don't complete it", "Add more practical exercises for hands-on learner style"],
  }),
  content_quality: (d) => ({
    title: "Content Quality Report", reportType: "content_quality", dateRange: (d.dateRange as string) || "current",
    summary: "5 content quality issues identified. SQL Foundations quiz has critical failure rate (52/100 quality score). 3 issues are open, 1 is under review.",
    keyMetrics: [{ label: "Total Issues", value: 5 }, { label: "Critical (< 60)", value: 3 }, { label: "Needs Review (60-79)", value: 2 }, { label: "Open Issues", value: 3 }],
    findings: ["SQL Foundations quiz at 52/100 — critical, high_failure_rate", "Power BI lecture at 63/100 — low_completion detected", "Lambda lecture has no quiz attached — engagement risk"],
    recommendedActions: ["Immediately add SQL Joins remedial lecture", "Split Power BI Fundamentals into two parts", "Attach quiz to Lambda and RAG lectures within 2 weeks"],
  }),
};

export async function generateReport(reportType: ReportType, dateRange: string = "last_30_days"): Promise<AdminReport> {
  const template = REPORT_TEMPLATES[reportType]({ dateRange });
  const client = await getGeminiClient();
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  let summary = template.summary;
  let generatedBy = "fallback";

  if (client) {
    const prompt = `You are an analytics expert for atomcamp, an EdTech platform. Generate a professional executive summary for a ${reportType.replace(/_/g, " ")} report covering ${dateRange}.

Platform Context:
- 5 programs, 27 lectures, 15 quizzes, 120+ learners
- Most recommended: Data Analytics Bootcamp
- Most difficult topic: SQL Joins (42% failure rate)
- 4 active instructors, 3 active cohorts
- Average completion: 62%, Average quiz score: 68%

Write 2-3 sentences as an executive summary. Be specific, data-driven, and actionable. No bullet points.`;

    try {
      const { text: geminiText } = await client.models.generateContent({ model, contents: prompt }) as unknown as { text?: string };
      if (geminiText) { summary = geminiText; generatedBy = "gemini"; }
    } catch { /* use fallback */ }
  }

  return {
    id: `rpt-${Date.now()}`,
    ...template,
    summary,
    generatedAt: new Date().toISOString(),
    generatedBy,
  };
}

export async function getReports(): Promise<AdminReport[]> {
  return DEMO_REPORTS;
}
