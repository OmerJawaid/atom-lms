export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  questionType: "mcq" | "true_false";
  options: QuestionOption[];
  correctAnswer: string;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  topic?: string;
  points: number;
  orderIndex: number;
  createdAt?: string;
}
