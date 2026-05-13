import { StudentProfile } from "@/lib/models/profile.model";
import { CourseRecommendation } from "@/lib/models/recommendation.model";
import { AdaptiveQuizResult, QuizHistoryItem } from "@/lib/models/quiz.model";
import { FALLBACK_RECOMMENDATIONS } from "@/lib/data/demoCourses";

const BASE_URL = process.env.MODEL_API_BASE_URL || "https://cussed-pope-ripeness.ngrok-free.dev";
const PROFILE_PATH = process.env.MODEL_PROFILE_PATH || "/profile";
const RECOMMEND_PATH = process.env.MODEL_RECOMMEND_PATH || "/recommend";
const QUIZ_PATH = process.env.MODEL_QUIZ_PATH || "/quiz";
const TIMEOUT_MS = parseInt(process.env.MODEL_TIMEOUT_MS || "8000");

const HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

const FALLBACK_PROFILE: StudentProfile = {
  skillLevel: "beginner",
  primaryGoal: "data science and machine learning",
  learningStyle: "hands-on practical learner",
  confidenceScore: 58,
  source: "fallback",
};

const FALLBACK_QUIZ: AdaptiveQuizResult = {
  nextDifficulty: "medium",
  accuracy: 67,
  weightedScore: 50,
  message: "Good progress. Maintaining difficulty.",
  source: "fallback",
};

export async function profileStudent(text: string): Promise<StudentProfile> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}${PROFILE_PATH}`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.error(`[model-api] Profile endpoint returned ${response.status}`);
      return FALLBACK_PROFILE;
    }

    const data = await response.json();

    if (!data.success || !data.profile) {
      return FALLBACK_PROFILE;
    }

    const p = data.profile;
    const skillLevel = (["beginner", "intermediate", "advanced"].includes(p.skill_level)
      ? p.skill_level
      : "beginner") as "beginner" | "intermediate" | "advanced";

    return {
      skillLevel,
      primaryGoal: p.primary_goal || "data science and machine learning",
      learningStyle: p.learning_style || "hands-on practical learner",
      confidenceScore: Math.round((p.confidence_score || 0.58) * 100),
      source: "model-api",
    };
  } catch (err) {
    console.error("[model-api] profileStudent error:", err);
    return FALLBACK_PROFILE;
  }
}

export async function recommendCourses(
  text: string
): Promise<{ profile: StudentProfile; recommendations: CourseRecommendation[] }> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}${RECOMMEND_PATH}`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.error(`[model-api] Recommend endpoint returned ${response.status}`);
      return { profile: FALLBACK_PROFILE, recommendations: FALLBACK_RECOMMENDATIONS };
    }

    const data = await response.json();

    if (!data.success) {
      return { profile: FALLBACK_PROFILE, recommendations: FALLBACK_RECOMMENDATIONS };
    }

    const p = data.profile || {};
    const skillLevel = (["beginner", "intermediate", "advanced"].includes(p.skill_level)
      ? p.skill_level
      : "beginner") as "beginner" | "intermediate" | "advanced";

    const profile: StudentProfile = {
      skillLevel,
      primaryGoal: p.primary_goal || "data science and machine learning",
      learningStyle: p.learning_style || "hands-on practical learner",
      confidenceScore: Math.round((p.confidence_score || 0.58) * 100),
      source: "model-api",
    };

    const recommendations: CourseRecommendation[] = (data.recommendations || []).map(
      (r: { id: number; title: string; description: string; similarity_score: number }) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        similarityScore: Math.round((r.similarity_score || 0) * 100),
      })
    );

    return {
      profile,
      recommendations: recommendations.length > 0 ? recommendations : FALLBACK_RECOMMENDATIONS,
    };
  } catch (err) {
    console.error("[model-api] recommendCourses error:", err);
    return { profile: FALLBACK_PROFILE, recommendations: FALLBACK_RECOMMENDATIONS };
  }
}

export async function getAdaptiveQuizResult(history: QuizHistoryItem[]): Promise<AdaptiveQuizResult> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}${QUIZ_PATH}`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ history }),
    });

    if (!response.ok) {
      console.error(`[model-api] Quiz endpoint returned ${response.status}`);
      return FALLBACK_QUIZ;
    }

    const data = await response.json();

    if (!data.success || !data.result) {
      return FALLBACK_QUIZ;
    }

    const r = data.result;
    const nextDifficulty = (["easy", "medium", "hard"].includes(r.next_difficulty)
      ? r.next_difficulty
      : "medium") as "easy" | "medium" | "hard";

    return {
      nextDifficulty,
      accuracy: Math.round((r.accuracy || 0.67) * 100),
      weightedScore: Math.round((r.weighted_score || 0.5) * 100),
      message: r.message || "Good progress. Maintaining difficulty.",
      source: "model-api",
    };
  } catch (err) {
    console.error("[model-api] getAdaptiveQuizResult error:", err);
    return FALLBACK_QUIZ;
  }
}

export async function checkModelApiHealth(): Promise<{
  connected: boolean;
  baseUrl: string;
  endpoints?: string[];
  message?: string;
}> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}`, {
      method: "GET",
      headers: HEADERS,
    });

    if (!response.ok) {
      return {
        connected: false,
        baseUrl: BASE_URL,
        message: `External model API returned ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      connected: true,
      baseUrl: BASE_URL,
      endpoints: data.endpoints || ["/profile", "/recommend", "/quiz"],
    };
  } catch (err) {
    console.error("[model-api] health check error:", err);
    return {
      connected: false,
      baseUrl: BASE_URL,
      message: "External model API unavailable. App is using fallback mode.",
    };
  }
}
