export type QualityIssueType =
  | "low_completion"
  | "high_failure_rate"
  | "outdated_content"
  | "unclear_quiz_questions"
  | "low_engagement"
  | "no_quiz_attached";

export type QualityStatus = "open" | "reviewing" | "fixed";

export interface ContentQualityReview {
  id: string;
  courseId: string;
  courseName?: string;
  lectureId?: string;
  lectureName?: string;
  quizId?: string;
  quizName?: string;
  qualityScore: number;
  issueType: QualityIssueType;
  recommendation: string;
  status: QualityStatus;
  createdAt?: string;
}
