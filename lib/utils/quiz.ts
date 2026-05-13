import { Question } from "@/lib/models/question.model";
import { AnswerRecord, GradeResult } from "@/lib/models/attempt.model";
import { QuizHistoryItem } from "@/lib/models/quiz.model";

export function gradeQuiz(
  questions: Question[],
  answers: Record<string, string>,
  passingScore: number = 60
): GradeResult {
  const answerRecords: AnswerRecord[] = questions.map((q) => {
    const selected = answers[q.id] ?? "";
    const isCorrect = selected === q.correctAnswer;
    return {
      questionId: q.id,
      selectedAnswer: selected,
      correctAnswer: q.correctAnswer,
      isCorrect,
      difficulty: q.difficulty,
      topic: q.topic,
    };
  });

  const correctCount = answerRecords.filter((a) => a.isCorrect).length;
  const total = questions.length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const wrongTopics = answerRecords
    .filter((a) => !a.isCorrect && a.topic)
    .map((a) => a.topic as string);
  const weakTopics = [...new Set(wrongTopics)];

  const score = accuracy;
  const passed = score >= passingScore;

  return { score, correctCount, totalQuestions: total, accuracy, passed, weakTopics, answers: answerRecords };
}

export function buildQuizHistory(answers: AnswerRecord[]): QuizHistoryItem[] {
  return answers.map((a, i) => ({
    question_id: i + 1,
    difficulty: a.difficulty,
    correct: a.isCorrect,
  }));
}

export function getWeightedScore(answers: AnswerRecord[]): number {
  const weights = { easy: 1, medium: 2, hard: 3 };
  const totalWeight = answers.reduce((sum, a) => sum + weights[a.difficulty], 0);
  const earnedWeight = answers.filter((a) => a.isCorrect).reduce((sum, a) => sum + weights[a.difficulty], 0);
  if (totalWeight === 0) return 0;
  return Math.round((earnedWeight / totalWeight) * 100);
}
