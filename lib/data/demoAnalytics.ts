import { AdminAnalytics } from "@/lib/models/analytics.model";

export const DEMO_ADMIN_ANALYTICS: AdminAnalytics = {
  totalLearners: 5,
  averageConfidence: 67,
  averageCareerReadiness: 58,
  mostRecommendedCourse: "AI & Machine Learning",
  mostCommonGoal: "data science and machine learning",
  averageQuizAccuracy: 64,
  highRiskCount: 2,
  coursePerformance: [
    { course: "Data Science Bootcamp", count: 4, avgScore: 72 },
    { course: "AI & Machine Learning", count: 4, avgScore: 78 },
    { course: "Business Analytics", count: 2, avgScore: 65 },
    { course: "Cloud Computing AWS", count: 2, avgScore: 55 },
    { course: "Web Development", count: 1, avgScore: 60 },
  ],
};

export const DEMO_ROADMAPS: Record<string, {
  weakTopic: string;
  instructorNote: string;
  mentorMessage: string;
  careerReadinessScore: number;
}> = {
  "demo-student-1": {
    weakTopic: "Machine Learning Foundations",
    instructorNote: "Monitor progress in ML foundations; assign project-based exercises.",
    mentorMessage: "Focus on hands-on projects and complete a mini ML notebook before moving to advanced topics.",
    careerReadinessScore: 52,
  },
  "demo-student-2": {
    weakTopic: "Deep Learning Architecture",
    instructorNote: "Student is progressing well; introduce neural network projects.",
    mentorMessage: "You're on track — dive deeper into PyTorch and build a small NLP project.",
    careerReadinessScore: 68,
  },
  "demo-student-3": {
    weakTopic: "SQL for Analytics",
    instructorNote: "Reinforce SQL fundamentals with hands-on exercises.",
    mentorMessage: "Practice SQL queries daily and build a Power BI dashboard from a real dataset.",
    careerReadinessScore: 48,
  },
  "demo-student-4": {
    weakTopic: "Model Optimization",
    instructorNote: "Advanced learner — provide challenges with model deployment and optimization.",
    mentorMessage: "Consider contributing to an open-source ML project to reach expert level.",
    careerReadinessScore: 82,
  },
  "demo-student-5": {
    weakTopic: "Cloud Architecture",
    instructorNote: "Needs structured onboarding to cloud concepts before advanced topics.",
    mentorMessage: "Start with AWS Free Tier labs and complete the Solutions Architect learning path.",
    careerReadinessScore: 40,
  },
};
