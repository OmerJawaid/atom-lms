export interface AdminAnalytics {
  totalLearners: number;
  averageConfidence: number;
  averageCareerReadiness: number;
  mostRecommendedCourse: string;
  mostCommonGoal: string;
  averageQuizAccuracy: number;
  highRiskCount: number;
  coursePerformance: CoursePerformanceItem[];
}

export interface CoursePerformanceItem {
  course: string;
  count: number;
  avgScore: number;
}

export interface InstructorInsights {
  atRiskStudents: AtRiskStudent[];
  weakTopicHeatmap: WeakTopicItem[];
  interventionSuggestions: InterventionItem[];
}

export interface AtRiskStudent {
  id: string;
  name: string;
  skillLevel: string;
  primaryGoal: string;
  confidenceScore: number;
  weakTopic: string;
  riskLevel: "High" | "Medium" | "Low";
  recommendedAction: string;
  careerReadinessScore: number;
}

export interface WeakTopicItem {
  topic: string;
  count: number;
  severity: "high" | "medium" | "low";
}

export interface InterventionItem {
  studentName: string;
  action: string;
  priority: "urgent" | "moderate" | "low";
}
