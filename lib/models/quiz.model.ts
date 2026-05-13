export interface QuizHistoryItem {
  question_id: number;
  difficulty: "easy" | "medium" | "hard";
  correct: boolean;
}

export interface AdaptiveQuizResult {
  nextDifficulty: "easy" | "medium" | "hard";
  accuracy: number;
  weightedScore: number;
  message: string;
  source: "model-api" | "fallback";
}

export interface RawQuizResponse {
  success: boolean;
  result: {
    next_difficulty: string;
    accuracy: number;
    weighted_score: number;
    message: string;
  };
}

export interface MockQuestion {
  id: number;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}
