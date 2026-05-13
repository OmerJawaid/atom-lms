import { NextRequest, NextResponse } from "next/server";
import { getInstructors, createInstructor } from "@/lib/services/admin.service";

export async function GET() {
  try {
    const instructors = await getInstructors();
    return NextResponse.json({ success: true, instructors });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load instructors" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, expertise, bio, status } = body;
    if (!name || !email) return NextResponse.json({ success: false, error: "Name and email required" }, { status: 400 });
    const instructor = await createInstructor({
      name, email, expertise: expertise || [], bio,
      assignedCourses: 0, rating: 0, status: status || "active",
    });
    return NextResponse.json({ success: true, instructor }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create instructor" }, { status: 500 });
  }
}
