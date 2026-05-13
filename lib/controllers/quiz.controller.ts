import { QuizRequestSchema } from "@/lib/utils/validators";
import { getAdaptiveQuizResult } from "@/lib/services/model-api.service";
import { AdaptiveQuizResult, QuizHistoryItem } from "@/lib/models/quiz.model";

const FALLBACK_QUIZ: AdaptiveQuizResult = {
  nextDifficulty: "medium",
  accuracy: 67,
  weightedScore: 50,
  message: "Good progress. Maintaining difficulty.",
  source: "fallback",
};

export async function handleQuizRequest(history: QuizHistoryItem[]): Promise<{
  success: boolean;
  result: AdaptiveQuizResult;
  error?: string;
  fallbackUsed?: boolean;
}> {
  const parsed = QuizRequestSchema.safeParse({ history });
  if (!parsed.success) {
    return {
      success: false,
      result: FALLBACK_QUIZ,
      error: parsed.error.issues[0]?.message || "Invalid quiz history",
      fallbackUsed: true,
    };
  }

  const result = await getAdaptiveQuizResult(parsed.data.history);
  return {
    success: true,
    result,
    fallbackUsed: result.source === "fallback",
  };
}
