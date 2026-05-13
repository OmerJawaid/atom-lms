import { NextRequest, NextResponse } from "next/server";
import { markLectureComplete, getLectureById } from "@/lib/services/lecture.service";

export async function POST(req: NextRequest, { params }: { params: Promise<{ lectureId: string }> }) {
  try {
    const { lectureId } = await params;
    const body = await req.json();
    const studentId: string = body.studentId || "demo-student";

    const lecture = await getLectureById(lectureId);
    if (!lecture) return NextResponse.json({ success: false, error: "Lecture not found" }, { status: 404 });

    const progress = await markLectureComplete(studentId, lectureId, lecture.courseId);
    return NextResponse.json({ success: true, progress });
  } catch (err) {
    console.error("[api/lectures/complete] POST error:", err);
    return NextResponse.json({ success: false, error: "Failed to mark lecture complete" }, { status: 500 });
  }
}
