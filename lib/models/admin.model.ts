export interface AdminMetrics {
  totalPrograms: number;
  publishedLectures: number;
  activeQuizzes: number;
  totalLearners: number;
  activeInstructors: number;
  activeCohorts: number;
  averageCompletion: number;
  averageQuizScore: number;
  highRiskLearners: number;
  mediumRiskLearners: number;
  mostRecommendedProgram: string;
  mostDifficultTopic: string;
}

export interface ProgramPerformance {
  programId: string;
  title: string;
  track: string;
  level: string;
  lectureCount: number;
  quizCount: number;
  cohortCount: number;
  enrolledLearners: number;
  averageCompletion: number;
  averageQuizScore: number;
  status: "published" | "draft";
}

export interface CohortPerformance {
  cohortId: string;
  name: string;
  program: string;
  instructor: string;
  enrolledCount: number;
  capacity: number;
  averageCompletion: number;
  averageQuizScore: number;
  riskCount: number;
  status: string;
}

export interface RiskDistribution {
  level: "high" | "medium" | "low";
  count: number;
  percentage: number;
}

export interface AIInsight {
  title: string;
  severity: "high" | "medium" | "low";
  evidence: string;
  recommendedAction: string;
  expectedImpact: string;
}

export interface AdminAIInsightsResponse {
  summary: string;
  insights: AIInsight[];
  generatedAt: string;
  modelUsed: "gemini" | "fallback";
}

export interface AdminSettings {
  platformName: string;
  defaultQuizPassingScore: number;
  adaptiveQuizEnabled: boolean;
  aiRecommendationsEnabled: boolean;
  geminiFeedbackEnabled: boolean;
  demoModeEnabled: boolean;
  minimumCompletionThreshold: number;
  highRiskScoreThreshold: number;
  mediumRiskScoreThreshold: number;
}

export interface PlatformEvent {
  id: string;
  eventType: string;
  actorRole?: string;
  actorId?: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AdminDashboardData {
  metrics: AdminMetrics;
  programPerformance: ProgramPerformance[];
  cohortPerformance: CohortPerformance[];
  riskDistribution: RiskDistribution[];
  recentPlatformEvents: PlatformEvent[];
  aiInsights: AIInsight[];
}
