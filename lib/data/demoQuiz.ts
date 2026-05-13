import { MockQuestion, QuizHistoryItem } from "@/lib/models/quiz.model";

export const MOCK_QUESTIONS: MockQuestion[] = [
  {
    id: 1,
    text: "What is the primary purpose of a pandas DataFrame in Python?",
    difficulty: "easy",
    topic: "Python & Data Science",
  },
  {
    id: 2,
    text: "Which algorithm is best suited for classification problems with non-linear decision boundaries?",
    difficulty: "medium",
    topic: "Machine Learning",
  },
  {
    id: 3,
    text: "Explain the concept of overfitting and one method to prevent it.",
    difficulty: "medium",
    topic: "Machine Learning Foundations",
  },
  {
    id: 4,
    text: "What is the difference between supervised and unsupervised learning?",
    difficulty: "easy",
    topic: "ML Concepts",
  },
  {
    id: 5,
    text: "How does backpropagation work in a neural network?",
    difficulty: "hard",
    topic: "Deep Learning",
  },
];

export const DEFAULT_QUIZ_HISTORY: QuizHistoryItem[] = [
  { question_id: 1, difficulty: "medium", correct: true },
  { question_id: 2, difficulty: "medium", correct: true },
  { question_id: 3, difficulty: "medium", correct: false },
];
