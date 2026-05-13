import { NextRequest, NextResponse } from "next/server";
import { getLectureById } from "@/lib/services/lecture.service";
import { getQuizzesByCourse } from "@/lib/services/quiz.service";
import { DEMO_QUIZZES } from "@/lib/data/demoQuizzes";

export async function GET(req: NextRequest, { params }: { params: Promise<{ lectureId: string }> }) {
  try {
    const { lectureId } = await params;
    const lecture = await getLectureById(lectureId);
    if (!lecture) return NextResponse.json({ success: false, error: "Lecture not found" }, { status: 404 });

    const quiz = DEMO_QUIZZES.find((q) => q.lectureId === lectureId) ?? null;
    return NextResponse.json({ success: true, lecture, quiz });
  } catch (err) {
    console.error("[api/lectures/[id]] GET error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch lecture" }, { status: 500 });
  }
}
