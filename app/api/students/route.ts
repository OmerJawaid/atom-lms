import { NextResponse } from "next/server";
import { getStudents } from "@/lib/services/supabase.service";
import { DEMO_STUDENTS } from "@/lib/data/demoStudents";

export async function GET() {
  try {
    const data = await getStudents();
    if (data && data.length > 0) {
      return NextResponse.json({ success: true, students: data, usingDemoData: false });
    }
    return NextResponse.json({
      success: true,
      students: DEMO_STUDENTS,
      usingDemoData: true,
    });
  } catch {
    return NextResponse.json({
      success: true,
      students: DEMO_STUDENTS,
      usingDemoData: true,
    });
  }
}
