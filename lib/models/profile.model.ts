export interface StudentProfile {
  skillLevel: "beginner" | "intermediate" | "advanced";
  primaryGoal: string;
  learningStyle: string;
  confidenceScore: number;
  source: "model-api" | "fallback";
}

export interface RawProfileResponse {
  success: boolean;
  profile: {
    skill_level: string;
    primary_goal: string;
    learning_style: string;
    confidence_score: number;
  };
}
