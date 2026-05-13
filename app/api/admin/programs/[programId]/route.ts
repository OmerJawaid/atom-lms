import { NextRequest, NextResponse } from "next/server";
import { getCourseById } from "@/lib/services/course.service";
import { getLecturesByCourseId } from "@/lib/services/lecture.service";
import { getQuizzesByCourse } from "@/lib/services/quiz.service";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ programId: string }> }) {
  const { programId } = await params;
  try {
    const course = await getCourseById(programId);
    if (!course) return NextResponse.json({ success: false, error: "Program not found" }, { status: 404 });
    const [lectures, quizzes] = await Promise.all([
      getLecturesByCourseId(programId),
      getQuizzesByCourse(programId),
    ]);
    return NextResponse.json({ success: true, program: course, lectures, quizzes });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load program" }, { status: 500 });
  }
}
