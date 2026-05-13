import { NextRequest, NextResponse } from "next/server";
import { getEnrollments, createEnrollment } from "@/lib/services/admin.service";
import { getStudents } from "@/lib/services/student.service";
import { getCourses } from "@/lib/services/course.service";

export async function GET() {
  try {
    const [enrollments, students, courses] = await Promise.all([
      getEnrollments(), getStudents(), getCourses(),
    ]);
    const enriched = enrollments.map((e) => ({
      ...e,
      studentName: students.find((s) => s.id === e.studentId)?.name || "Unknown",
      courseName: courses.find((c) => c.id === e.courseId)?.title || "Unknown",
    }));
    return NextResponse.json({ success: true, enrollments: enriched });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load enrollments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, courseId, cohortId, paymentStatus } = body;
    if (!studentId || !courseId) return NextResponse.json({ success: false, error: "studentId and courseId required" }, { status: 400 });
    const enrollment = await createEnrollment({
      studentId, courseId, cohortId,
      enrollmentStatus: "active", paymentStatus: paymentStatus || "demo",
      progressPercent: 0, completionStatus: "not_started",
    });
    return NextResponse.json({ success: true, enrollment }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create enrollment" }, { status: 500 });
  }
}
