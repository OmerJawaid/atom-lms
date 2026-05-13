import { NextRequest, NextResponse } from "next/server";
import { getQuizById, getQuestionsByQuiz, saveQuizAttempt } from "@/lib/services/quiz.service";
import { gradeQuiz, buildQuizHistory, getWeightedScore } from "@/lib/utils/quiz";
import { getAdaptiveQuizResult } from "@/lib/services/model-api.service";
import { generateQuizFeedback } from "@/lib/services/gemini.service";

export async function POST(req: NextRequest, { params }: { params: Promise<{ quizId: string }> }) {
  try {
    const { quizId } = await params;
    const body = await req.json();
    const studentId: string = body.studentId || "demo-student";
    const answers: Record<string, string> = body.answers || {};
    const startedAt: string = body.startedAt || new Date().toISOString();

    const [quiz, questions] = await Promise.all([getQuizById(quizId), getQuestionsByQuiz(quizId)]);
    if (!quiz) return NextResponse.json({ success: false, error: "Quiz not found" }, { status: 404 });
    if (!questions.length) return NextResponse.json({ success: false, error: "No questions found" }, { status: 404 });

    const gradeResult = gradeQuiz(questions, answers, quiz.passingScore);
    const weightedScore = getWeightedScore(gradeResult.answers);
    const history = buildQuizHistory(gradeResult.answers);

    const [adaptiveResult, aiFeedback] = await Promise.all([
      getAdaptiveQuizResult(history),
      generateQuizFeedback({
        quizTitle: quiz.title,
        score: gradeResult.score,
        accuracy: gradeResult.accuracy,
        weakTopics: gradeResult.weakTopics,
        nextDifficulty: "medium",
        answers: gradeResult.answers.map((a) => ({
          questionText: questions.find((q) => q.id === a.questionId)?.questionText || "",
          isCorrect: a.isCorrect,
          difficulty: a.difficulty,
          topic: a.topic,
        })),
      }),
    ]);

    const attempt = await saveQuizAttempt({
      studentId,
      quizId,
      lectureId: quiz.lectureId,
      answers: gradeResult.answers,
      score: gradeResult.score,
      totalQuestions: gradeResult.totalQuestions,
      correctCount: gradeResult.correctCount,
      accuracy: gradeResult.accuracy,
      weightedScore: adaptiveResult.weightedScore || weightedScore,
      nextDifficulty: adaptiveResult.nextDifficulty,
      passed: gradeResult.passed,
      aiFeedback: aiFeedback,
      weakTopics: gradeResult.weakTopics,
      startedAt,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      result: {
        score: gradeResult.score,
        correctCount: gradeResult.correctCount,
        totalQuestions: gradeResult.totalQuestions,
        accuracy: gradeResult.accuracy,
        weightedScore: adaptiveResult.weightedScore || weightedScore,
        nextDifficulty: adaptiveResult.nextDifficulty,
        passed: gradeResult.passed,
        aiFeedback,
        weakTopics: gradeResult.weakTopics,
        answers: gradeResult.answers,
        attemptId: attempt?.id,
      },
    });
  } catch (err) {
    console.error("[api/quizzes/submit] POST error:", err);
    return NextResponse.json({ success: false, error: "Failed to submit quiz" }, { status: 500 });
  }
}
