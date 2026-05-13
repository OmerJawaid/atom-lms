export type ReportType =
  | "learner_progress"
  | "course_performance"
  | "cohort_summary"
  | "instructor_performance"
  | "quiz_performance"
  | "ai_recommendation_summary"
  | "content_quality";

export interface ReportKeyMetric {
  label: string;
  value: string | number;
  change?: string;
}

export interface AdminReport {
  id: string;
  title: string;
  reportType: ReportType;
  dateRange?: string;
  summary: string;
  keyMetrics: ReportKeyMetric[];
  findings: string[];
  recommendedActions: string[];
  generatedAt: string;
  generatedBy: string;
  data?: Record<string, unknown>;
}
