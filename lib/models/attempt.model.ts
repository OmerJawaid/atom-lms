export interface AnswerRecord {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  difficulty: "easy" | "medium" | "hard";
  topic?: string;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  lectureId?: string;
  answers: AnswerRecord[];
  score: number;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  weightedScore: number;
  nextDifficulty?: "easy" | "medium" | "hard";
  passed: boolean;
  aiFeedback?: string;
  weakTopics: string[];
  startedAt: string;
  submittedAt: string;
}

export interface GradeResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  passed: boolean;
  weakTopics: string[];
  answers: AnswerRecord[];
}
