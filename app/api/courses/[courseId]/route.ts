import { NextRequest, NextResponse } from "next/server";
import { getCourseById } from "@/lib/services/course.service";
import { getLecturesByCourseId } from "@/lib/services/lecture.service";
import { getQuizzesByCourse } from "@/lib/services/quiz.service";

export async function GET(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await params;
    const [course, lectures, quizzes] = await Promise.all([
      getCourseById(courseId),
      getLecturesByCourseId(courseId),
      getQuizzesByCourse(courseId),
    ]);
    if (!course) return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    return NextResponse.json({ success: true, course, lectures, quizzes });
  } catch (err) {
    console.error("[api/courses/[id]] GET error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch course" }, { status: 500 });
  }
}
