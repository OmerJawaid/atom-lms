export interface RoadmapWeek {
  week: number;
  module: string;
  status: "Completed" | "In Progress" | "AI Recommended" | "Upcoming" | "Locked";
  reason: string;
}

export interface LearningRoadmap {
  roadmapTitle: string;
  summary: string;
  nextBestLesson: string;
  weakTopic: string;
  careerReadinessScore: number;
  roadmap: RoadmapWeek[];
  mentorMessage: string;
  instructorNote: string;
  modelUsed?: "gemini" | "fallback";
}

export interface GeminiRoadmapInput {
  studentText: string;
  profile: {
    skillLevel: string;
    primaryGoal: string;
    learningStyle: string;
    confidenceScore: number;
  };
  recommendations: Array<{
    title: string;
    similarityScore: number;
  }>;
  quiz: {
    nextDifficulty: string;
    accuracy: number;
    weightedScore: number;
  };
}
