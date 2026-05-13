import { RecommendRequestSchema } from "@/lib/utils/validators";
import { recommendCourses } from "@/lib/services/model-api.service";
import { StudentProfile } from "@/lib/models/profile.model";
import { CourseRecommendation } from "@/lib/models/recommendation.model";
import { FALLBACK_RECOMMENDATIONS } from "@/lib/data/demoCourses";

const FALLBACK_PROFILE: StudentProfile = {
  skillLevel: "beginner",
  primaryGoal: "data science and machine learning",
  learningStyle: "hands-on practical learner",
  confidenceScore: 58,
  source: "fallback",
};

export async function handleRecommendationRequest(text: string): Promise<{
  success: boolean;
  profile: StudentProfile;
  recommendations: CourseRecommendation[];
  error?: string;
  fallbackUsed?: boolean;
}> {
  const parsed = RecommendRequestSchema.safeParse({ text });
  if (!parsed.success) {
    return {
      success: false,
      profile: FALLBACK_PROFILE,
      recommendations: FALLBACK_RECOMMENDATIONS,
      error: parsed.error.issues[0]?.message || "Invalid input",
      fallbackUsed: true,
    };
  }

  const result = await recommendCourses(parsed.data.text);
  return {
    success: true,
    profile: result.profile,
    recommendations: result.recommendations,
    fallbackUsed: result.profile.source === "fallback",
  };
}
