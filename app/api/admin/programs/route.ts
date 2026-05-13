import { NextResponse } from "next/server";
import { getCourses } from "@/lib/services/course.service";
import { DEMO_PROGRAM_PERFORMANCE } from "@/lib/data/demoAdmin";

export async function GET() {
  try {
    const courses = await getCourses();
    const enriched = courses.map((c) => {
      const perf = DEMO_PROGRAM_PERFORMANCE.find((p) => p.title === c.title);
      return { ...c, performance: perf || null };
    });
    return NextResponse.json({ success: true, programs: enriched });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load programs" }, { status: 500 });
  }
}
