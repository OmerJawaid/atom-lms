import { NextResponse } from "next/server";
import { getCourses } from "@/lib/services/course.service";

export async function GET() {
  try {
    const courses = await getCourses();
    return NextResponse.json({ success: true, courses });
  } catch (err) {
    console.error("[api/courses] GET error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch courses" }, { status: 500 });
  }
}
