import { NextResponse } from "next/server";
import { getStudents } from "@/lib/services/supabase.service";
import { DEMO_STUDENTS } from "@/lib/data/demoStudents";

export async function GET() {
  try {
    const data = await getStudents();
    const students = data || DEMO_STUDENTS;
    return NextResponse.json({ success: true, students });
  } catch (err) {
    console.error("[api/instructor/students] GET error:", err);
    return NextResponse.json({ success: true, students: DEMO_STUDENTS });
  }
}
