import { Instructor } from "@/lib/models/instructor.model";
import { Cohort } from "@/lib/models/cohort.model";
import { Enrollment } from "@/lib/models/enrollment.model";
import { AdminReport } from "@/lib/models/report.model";
import { ContentQualityReview } from "@/lib/models/content-quality.model";
import { PlatformEvent, AdminSettings, AdminMetrics, ProgramPerformance, CohortPerformance, RiskDistribution } from "@/lib/models/admin.model";

export const DEMO_INSTRUCTORS: Instructor[] = [
  { id: "i1000000-0000-0000-0000-000000000001", name: "Dr. Ayesha Malik", email: "ayesha.malik@atomcamp.io", expertise: ["Data Science", "Machine Learning", "Python"], bio: "PhD in Computer Science from LUMS. 8 years of industry experience in ML and data engineering.", assignedCourses: 2, rating: 92, status: "active", assignedCohorts: 2, avgLearnerScore: 74, completionRate: 81 },
  { id: "i1000000-0000-0000-0000-000000000002", name: "Ahmed Raza", email: "ahmed.raza@atomcamp.io", expertise: ["Business Analytics", "Power BI", "SQL"], bio: "Former data lead at a Big 4 firm. Specializes in making analytics accessible to non-technical professionals.", assignedCourses: 2, rating: 88, status: "active", assignedCohorts: 1, avgLearnerScore: 71, completionRate: 78 },
  { id: "i1000000-0000-0000-0000-000000000003", name: "Sarah Khan", email: "sarah.khan@atomcamp.io", expertise: ["Cloud Computing", "AWS", "DevOps"], bio: "AWS Certified Solutions Architect and DevOps practitioner with 6 years of cloud infrastructure experience.", assignedCourses: 1, rating: 85, status: "active", assignedCohorts: 1, avgLearnerScore: 69, completionRate: 73 },
  { id: "i1000000-0000-0000-0000-000000000004", name: "Hamza Ali", email: "hamza.ali@atomcamp.io", expertise: ["AI Agents", "Automation", "Prompt Engineering"], bio: "AI engineer and entrepreneur. Builds autonomous agents for enterprise clients. Active contributor to LangChain.", assignedCourses: 1, rating: 90, status: "active", assignedCohorts: 1, avgLearnerScore: 66, completionRate: 70 },
];

export const DEMO_COHORTS: Cohort[] = [
  { id: "co100000-0000-0000-0000-000000000001", name: "Data Analytics Bootcamp - Spring Cohort", programId: "c1000000-0000-0000-0000-000000000001", instructorId: "i1000000-0000-0000-0000-000000000002", programName: "Data Analytics Bootcamp", instructorName: "Ahmed Raza", startDate: "2026-03-01", endDate: "2026-04-15", capacity: 30, enrolledCount: 24, status: "active", averageCompletion: 68, averageQuizScore: 71, riskCount: 4 },
  { id: "co100000-0000-0000-0000-000000000002", name: "AI & Machine Learning - Weekend Cohort", programId: "c2000000-0000-0000-0000-000000000002", instructorId: "i1000000-0000-0000-0000-000000000001", programName: "AI & ML Foundations", instructorName: "Dr. Ayesha Malik", startDate: "2026-02-15", endDate: "2026-04-30", capacity: 25, enrolledCount: 18, status: "active", averageCompletion: 55, averageQuizScore: 64, riskCount: 6 },
  { id: "co100000-0000-0000-0000-000000000003", name: "Cloud Computing AWS - Evening Cohort", programId: "c4000000-0000-0000-0000-000000000004", instructorId: "i1000000-0000-0000-0000-000000000003", programName: "Cloud Computing with AWS", instructorName: "Sarah Khan", startDate: "2026-06-01", endDate: "2026-07-15", capacity: 30, enrolledCount: 12, status: "upcoming", averageCompletion: 0, averageQuizScore: 0, riskCount: 0 },
  { id: "co100000-0000-0000-0000-000000000004", name: "Agentic AI & Automation - Fast Track", programId: "c5000000-0000-0000-0000-000000000005", instructorId: "i1000000-0000-0000-0000-000000000004", programName: "Agentic AI Engineering", instructorName: "Hamza Ali", startDate: "2026-04-01", endDate: "2026-05-15", capacity: 20, enrolledCount: 16, status: "active", averageCompletion: 42, averageQuizScore: 61, riskCount: 5 },
];

export const DEMO_ENROLLMENTS: Enrollment[] = [
  { id: "en100000-0000-0000-0000-000000000001", studentId: "s1000000-0000-0000-0000-000000000001", studentName: "Ali Khan", courseId: "c1000000-0000-0000-0000-000000000001", courseName: "Data Analytics Bootcamp", cohortId: "co100000-0000-0000-0000-000000000001", cohortName: "Spring Cohort", enrollmentStatus: "active", paymentStatus: "demo", progressPercent: 65, completionStatus: "in_progress", enrolledAt: "2026-03-01T08:00:00Z" },
  { id: "en100000-0000-0000-0000-000000000002", studentId: "s1000000-0000-0000-0000-000000000002", studentName: "Sara Ahmed", courseId: "c2000000-0000-0000-0000-000000000002", courseName: "AI & ML Foundations", cohortId: "co100000-0000-0000-0000-000000000002", cohortName: "Weekend Cohort", enrollmentStatus: "active", paymentStatus: "demo", progressPercent: 80, completionStatus: "in_progress", enrolledAt: "2026-02-15T09:00:00Z" },
  { id: "en100000-0000-0000-0000-000000000003", studentId: "s1000000-0000-0000-0000-000000000003", studentName: "Hamza Raza", courseId: "c3000000-0000-0000-0000-000000000003", courseName: "Business Analytics Pro", cohortId: undefined, cohortName: undefined, enrollmentStatus: "active", paymentStatus: "demo", progressPercent: 30, completionStatus: "in_progress", enrolledAt: "2026-03-10T10:00:00Z" },
  { id: "en100000-0000-0000-0000-000000000004", studentId: "s1000000-0000-0000-0000-000000000004", studentName: "Ayesha Noor", courseId: "c2000000-0000-0000-0000-000000000002", courseName: "AI & ML Foundations", cohortId: "co100000-0000-0000-0000-000000000002", cohortName: "Weekend Cohort", enrollmentStatus: "active", paymentStatus: "demo", progressPercent: 92, completionStatus: "in_progress", enrolledAt: "2026-02-15T09:30:00Z" },
  { id: "en100000-0000-0000-0000-000000000005", studentId: "s1000000-0000-0000-0000-000000000005", studentName: "Usman Malik", courseId: "c4000000-0000-0000-0000-000000000004", courseName: "Cloud Computing with AWS", cohortId: "co100000-0000-0000-0000-000000000003", cohortName: "Evening Cohort", enrollmentStatus: "active", paymentStatus: "demo", progressPercent: 20, completionStatus: "in_progress", enrolledAt: "2026-06-01T08:00:00Z" },
  { id: "en100000-0000-0000-0000-000000000006", studentId: "s1000000-0000-0000-0000-000000000001", studentName: "Ali Khan", courseId: "c5000000-0000-0000-0000-000000000005", courseName: "Agentic AI Engineering", cohortId: "co100000-0000-0000-0000-000000000004", cohortName: "Fast Track", enrollmentStatus: "active", paymentStatus: "demo", progressPercent: 45, completionStatus: "in_progress", enrolledAt: "2026-04-01T08:00:00Z" },
  { id: "en100000-0000-0000-0000-000000000007", studentId: "s1000000-0000-0000-0000-000000000002", studentName: "Sara Ahmed", courseId: "c1000000-0000-0000-0000-000000000001", courseName: "Data Analytics Bootcamp", cohortId: "co100000-0000-0000-0000-000000000001", cohortName: "Spring Cohort", enrollmentStatus: "completed", paymentStatus: "demo", progressPercent: 100, completionStatus: "completed", enrolledAt: "2026-01-10T08:00:00Z" },
  { id: "en100000-0000-0000-0000-000000000008", studentId: "s1000000-0000-0000-0000-000000000003", studentName: "Hamza Raza", courseId: "c1000000-0000-0000-0000-000000000001", courseName: "Data Analytics Bootcamp", cohortId: "co100000-0000-0000-0000-000000000001", cohortName: "Spring Cohort", enrollmentStatus: "paused", paymentStatus: "demo", progressPercent: 15, completionStatus: "in_progress", enrolledAt: "2026-03-01T08:00:00Z" },
  { id: "en100000-0000-0000-0000-000000000009", studentId: "s1000000-0000-0000-0000-000000000004", studentName: "Ayesha Noor", courseId: "c5000000-0000-0000-0000-000000000005", courseName: "Agentic AI Engineering", cohortId: "co100000-0000-0000-0000-000000000004", cohortName: "Fast Track", enrollmentStatus: "active", paymentStatus: "demo", progressPercent: 78, completionStatus: "in_progress", enrolledAt: "2026-04-01T08:00:00Z" },
  { id: "en100000-0000-0000-0000-000000000010", studentId: "s1000000-0000-0000-0000-000000000005", studentName: "Usman Malik", courseId: "c2000000-0000-0000-0000-000000000002", courseName: "AI & ML Foundations", cohortId: "co100000-0000-0000-0000-000000000002", cohortName: "Weekend Cohort", enrollmentStatus: "dropped", paymentStatus: "demo", progressPercent: 8, completionStatus: "in_progress", enrolledAt: "2026-02-15T09:00:00Z" },
];

export const DEMO_CONTENT_QUALITY: ContentQualityReview[] = [
  { id: "cq1", courseId: "c1000000-0000-0000-0000-000000000001", courseName: "Data Analytics Bootcamp", lectureId: "l1000000-0000-0000-0000-000000000002", lectureName: "SQL Fundamentals for Data Analysis", quizId: "q1000000-0000-0000-0000-000000000001", quizName: "SQL Foundations Quiz", qualityScore: 52, issueType: "high_failure_rate", recommendation: "Add a dedicated SQL Joins remedial lecture with 5 interactive exercises. Current failure rate on JOIN questions is 42%.", status: "open" },
  { id: "cq2", courseId: "c3000000-0000-0000-0000-000000000003", courseName: "Business Analytics Pro", lectureId: "l3000000-0000-0000-0000-000000000003", lectureName: "Power BI Fundamentals", quizId: "q3000000-0000-0000-0000-000000000003", quizName: "Power BI Quiz", qualityScore: 63, issueType: "low_completion", recommendation: "Break the Power BI Fundamentals lecture into two shorter parts. Current drop-off at 60% indicates content overload.", status: "reviewing" },
  { id: "cq3", courseId: "c2000000-0000-0000-0000-000000000002", courseName: "AI & ML Foundations", lectureId: "l2000000-0000-0000-0000-000000000005", lectureName: "Model Evaluation and Hyperparameter Tuning", quizId: "q2000000-0000-0000-0000-000000000004", quizName: "Model Evaluation Quiz", qualityScore: 58, issueType: "unclear_quiz_questions", recommendation: "Rephrase bias-variance tradeoff questions. Multiple learners flag Q4 and Q5 as ambiguous.", status: "open" },
  { id: "cq4", courseId: "c4000000-0000-0000-0000-000000000004", courseName: "Cloud Computing with AWS", lectureId: "l4000000-0000-0000-0000-000000000004", lectureName: "Lambda and Serverless Architecture", quizId: undefined, quizName: undefined, qualityScore: 72, issueType: "no_quiz_attached", recommendation: "Add a 5-question quiz to Lambda lecture to reinforce serverless patterns and cold-start concepts.", status: "open" },
  { id: "cq5", courseId: "c5000000-0000-0000-0000-000000000005", courseName: "Agentic AI Engineering", lectureId: "l5000000-0000-0000-0000-000000000003", lectureName: "RAG: Retrieval-Augmented Generation", quizId: undefined, quizName: undefined, qualityScore: 68, issueType: "low_engagement", recommendation: "Add a hands-on RAG coding exercise. Learners report the lecture is too theoretical without a practical component.", status: "open" },
];

export const DEMO_REPORTS: AdminReport[] = [
  {
    id: "rpt-001", title: "Course Performance Report — May 2026", reportType: "course_performance", dateRange: "last_30_days",
    summary: "Data Analytics Bootcamp has the highest enrollment (24 active learners) but SQL Foundations quiz remains the weakest-scoring assessment at 58% average. AI/ML Foundations shows the sharpest improvement trend week-over-week.",
    keyMetrics: [
      { label: "Total Active Enrollments", value: 70 }, { label: "Avg Course Completion", value: "62%" },
      { label: "Avg Quiz Score", value: "67%" }, { label: "Top Performing Course", value: "Business Analytics Pro" },
      { label: "Lowest Quiz Score", value: "SQL Foundations (58%)" },
    ],
    findings: ["SQL Joins topic causes 42% of quiz failures across Data Analytics Bootcamp", "Business Analytics Pro has the highest pass rate at 86%", "Agentic AI Engineering has the lowest completion rate at 42%", "Model Evaluation quiz has the second-highest failure rate"],
    recommendedActions: ["Add SQL Joins remedial lecture to Data Analytics Bootcamp", "Create adaptive quiz difficulty for Neural Networks module", "Assign extra mentor sessions for Agentic AI Fast Track cohort"],
    generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), generatedBy: "system",
  },
  {
    id: "rpt-002", title: "Learner Risk Summary — Active Cohorts", reportType: "learner_progress", dateRange: "current",
    summary: "15 learners across active cohorts are at high risk based on quiz scores below 50% and career readiness below 55. The AI/ML Weekend Cohort has the highest risk concentration with 6 at-risk learners.",
    keyMetrics: [
      { label: "Total Learners Assessed", value: 42 }, { label: "High Risk", value: "15 (36%)" },
      { label: "Medium Risk", value: "12 (29%)" }, { label: "On Track", value: "15 (35%)" },
      { label: "Avg Career Readiness", value: "61%" },
    ],
    findings: ["AI/ML Weekend Cohort has the most at-risk learners (6 of 18)", "Backpropagation and SQL Joins are the two most common weak topics", "Learners who completed onboarding have 2.3x better quiz scores"],
    recommendedActions: ["Schedule group revision session for AI/ML Weekend Cohort", "Send targeted email to 15 high-risk learners with study resources", "Flag 5 learners with zero progress for instructor outreach"],
    generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), generatedBy: "system",
  },
  {
    id: "rpt-003", title: "Instructor Performance Summary", reportType: "instructor_performance", dateRange: "last_30_days",
    summary: "Dr. Ayesha Malik leads in learner satisfaction with a 92/100 rating. Ahmed Raza's SQL sessions show strong completion rates. All four active instructors are meeting minimum performance thresholds.",
    keyMetrics: [
      { label: "Active Instructors", value: 4 }, { label: "Avg Instructor Rating", value: "88.75" },
      { label: "Avg Learner Score (across instructors)", value: "70%" }, { label: "Avg Completion Rate", value: "75.5%" },
    ],
    findings: ["Dr. Ayesha Malik has highest rating (92) and learner score (74%)", "Hamza Ali's Agentic AI cohort has lowest completion (70%) but highest engagement", "Ahmed Raza's Business Analytics cohort shows strongest pass rates"],
    recommendedActions: ["Invite Dr. Ayesha Malik to mentor junior instructors", "Review Hamza Ali's completion strategies for actionable best practices"],
    generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), generatedBy: "system",
  },
];

export const DEMO_PLATFORM_EVENTS: PlatformEvent[] = [
  { id: "evt-001", eventType: "learner_onboarded", actorRole: "student", description: "Ali Khan completed onboarding and received AI profile", createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: "evt-002", eventType: "quiz_submitted", actorRole: "student", description: "Sara Ahmed submitted ML Foundations Quiz — Score: 80%", createdAt: new Date(Date.now() - 1000 * 60 * 32).toISOString() },
  { id: "evt-003", eventType: "lecture_completed", actorRole: "student", description: "Ayesha Noor completed Neural Networks and Deep Learning lecture", createdAt: new Date(Date.now() - 1000 * 60 * 58).toISOString() },
  { id: "evt-004", eventType: "ai_recommendation_generated", actorRole: "system", description: "Gemini generated learning roadmap for Usman Malik — Data Science path", createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: "evt-005", eventType: "instructor_added", actorRole: "admin", description: "Hamza Ali added as instructor for Agentic AI Engineering cohort", createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  { id: "evt-006", eventType: "course_created", actorRole: "admin", description: "Agentic AI Engineering program published to course catalog", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
  { id: "evt-007", eventType: "quiz_submitted", actorRole: "student", description: "Hamza Raza submitted SQL Foundations Quiz — Score: 40% (Failed)", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: "evt-008", eventType: "intervention_created", actorRole: "instructor", description: "Ahmed Raza created intervention for at-risk learner in SQL module", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() },
];

export const DEMO_ADMIN_SETTINGS: AdminSettings = {
  platformName: "Atom Adaptive Intelligence Hub",
  defaultQuizPassingScore: 60,
  adaptiveQuizEnabled: true,
  aiRecommendationsEnabled: true,
  geminiFeedbackEnabled: true,
  demoModeEnabled: true,
  minimumCompletionThreshold: 70,
  highRiskScoreThreshold: 50,
  mediumRiskScoreThreshold: 65,
};

export const DEMO_METRICS: AdminMetrics = {
  totalPrograms: 5, publishedLectures: 27, activeQuizzes: 15, totalLearners: 120,
  activeInstructors: 4, activeCohorts: 3, averageCompletion: 62, averageQuizScore: 68,
  highRiskLearners: 14, mediumRiskLearners: 22, mostRecommendedProgram: "Data Analytics Bootcamp",
  mostDifficultTopic: "SQL Joins",
};

export const DEMO_PROGRAM_PERFORMANCE: ProgramPerformance[] = [
  { programId: "c1000000-0000-0000-0000-000000000001", title: "Data Analytics Bootcamp", track: "Data", level: "beginner", lectureCount: 6, quizCount: 4, cohortCount: 1, enrolledLearners: 28, averageCompletion: 68, averageQuizScore: 71, status: "published" },
  { programId: "c2000000-0000-0000-0000-000000000002", title: "AI & ML Foundations", track: "AI/ML", level: "intermediate", lectureCount: 6, quizCount: 4, cohortCount: 1, enrolledLearners: 22, averageCompletion: 55, averageQuizScore: 64, status: "published" },
  { programId: "c3000000-0000-0000-0000-000000000003", title: "Business Analytics Pro", track: "Business", level: "beginner", lectureCount: 5, quizCount: 3, cohortCount: 0, enrolledLearners: 18, averageCompletion: 74, averageQuizScore: 78, status: "published" },
  { programId: "c4000000-0000-0000-0000-000000000004", title: "Cloud Computing with AWS", track: "Cloud", level: "intermediate", lectureCount: 5, quizCount: 2, cohortCount: 1, enrolledLearners: 15, averageCompletion: 48, averageQuizScore: 66, status: "published" },
  { programId: "c5000000-0000-0000-0000-000000000005", title: "Agentic AI Engineering", track: "AI/ML", level: "advanced", lectureCount: 5, quizCount: 2, cohortCount: 1, enrolledLearners: 19, averageCompletion: 42, averageQuizScore: 61, status: "published" },
];

export const DEMO_COHORT_PERFORMANCE: CohortPerformance[] = DEMO_COHORTS.map((c) => ({
  cohortId: c.id, name: c.name, program: c.programName || "", instructor: c.instructorName || "",
  enrolledCount: c.enrolledCount, capacity: c.capacity, averageCompletion: c.averageCompletion || 0,
  averageQuizScore: c.averageQuizScore || 0, riskCount: c.riskCount || 0, status: c.status,
}));

export const DEMO_RISK_DISTRIBUTION: import("@/lib/models/admin.model").RiskDistribution[] = [
  { level: "high", count: 14, percentage: 29 },
  { level: "medium", count: 22, percentage: 46 },
  { level: "low", count: 12, percentage: 25 },
];
