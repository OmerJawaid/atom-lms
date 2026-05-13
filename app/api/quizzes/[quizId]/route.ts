import { NextRequest, NextResponse } from "next/server";
import { getQuizById, getQuestionsByQuiz } from "@/lib/services/quiz.service";

export async function GET(req: NextRequest, { params }: { params: Promise<{ quizId: string }> }) {
  try {
    const { quizId } = await params;
    const [quiz, questions] = await Promise.all([
      getQuizById(quizId),
      getQuestionsByQuiz(quizId),
    ]);
    if (!quiz) return NextResponse.json({ success: false, error: "Quiz not found" }, { status: 404 });
    return NextResponse.json({ success: true, quiz, questions });
  } catch (err) {
    console.error("[api/quizzes/[id]] GET error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch quiz" }, { status: 500 });
  }
}
