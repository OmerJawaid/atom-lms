import { NextRequest, NextResponse } from "next/server";
import { getQuizById } from "@/lib/services/quiz.service";
import { getLectureById } from "@/lib/services/lecture.service";
import { generateQuizQuestions } from "@/lib/services/gemini.service";

export async function POST(req: NextRequest, { params }: { params: Promise<{ quizId: string }> }) {
  try {
    const { quizId } = await params;
    const body = await req.json();
    const count: number = body.count || 5;

    const quiz = await getQuizById(quizId);
    if (!quiz) return NextResponse.json({ success: false, error: "Quiz not found" }, { status: 404 });

    const lecture = quiz.lectureId ? await getLectureById(quiz.lectureId) : null;

    const questions = await generateQuizQuestions({
      lectureTitle: lecture?.title || quiz.title,
      lectureContent: lecture?.content || `Quiz about: ${quiz.title}. ${quiz.description || ""}`,
      count,
      difficulty: quiz.difficulty,
    });

    return NextResponse.json({ success: true, questions, count: questions.length });
  } catch (err) {
    console.error("[api/quizzes/generate-questions] POST error:", err);
    return NextResponse.json({ success: false, error: "Failed to generate questions" }, { status: 500 });
  }
}
