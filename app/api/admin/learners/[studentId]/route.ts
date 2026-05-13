import { NextRequest, NextResponse } from "next/server";
import { getStudentById } from "@/lib/services/student.service";
import { getAttemptsByStudent } from "@/lib/services/quiz.service";
import { getProgressByCourse } from "@/lib/services/lecture.service";
import { DEMO_COURSES } from "@/lib/models/course.model";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  try {
    const student = await getStudentById(studentId);
    if (!student) return NextResponse.json({ success: false, error: "Learner not found" }, { status: 404 });
    const [attempts, progressMap] = await Promise.all([
      getAttemptsByStudent(studentId),
      Promise.all(DEMO_COURSES.map((c) => getProgressByCourse(studentId, c.id).then((p) => ({ courseId: c.id, progress: p })))),
    ]);
    return NextResponse.json({ success: true, student, attempts, courseProgress: progressMap });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load learner" }, { status: 500 });
  }
}
