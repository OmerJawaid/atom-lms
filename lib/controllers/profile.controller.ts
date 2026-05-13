import { ProfileRequestSchema } from "@/lib/utils/validators";
import { profileStudent } from "@/lib/services/model-api.service";
import { StudentProfile } from "@/lib/models/profile.model";

const FALLBACK_PROFILE: StudentProfile = {
  skillLevel: "beginner",
  primaryGoal: "data science and machine learning",
  learningStyle: "hands-on practical learner",
  confidenceScore: 58,
  source: "fallback",
};

export async function handleProfileRequest(text: string): Promise<{
  success: boolean;
  profile: StudentProfile;
  error?: string;
  fallbackUsed?: boolean;
}> {
  const parsed = ProfileRequestSchema.safeParse({ text });
  if (!parsed.success) {
    return {
      success: false,
      profile: FALLBACK_PROFILE,
      error: parsed.error.issues[0]?.message || "Invalid input",
      fallbackUsed: true,
    };
  }

  const profile = await profileStudent(parsed.data.text);
  return {
    success: true,
    profile,
    fallbackUsed: profile.source === "fallback",
  };
}
