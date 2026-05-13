import { NextRequest, NextResponse } from "next/server";
import { getCohorts, createCohort } from "@/lib/services/admin.service";

export async function GET() {
  try {
    const cohorts = await getCohorts();
    return NextResponse.json({ success: true, cohorts });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load cohorts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, programId, instructorId, startDate, endDate, capacity, status } = body;
    if (!name) return NextResponse.json({ success: false, error: "Cohort name required" }, { status: 400 });
    const cohort = await createCohort({
      name, programId, instructorId, startDate, endDate,
      capacity: capacity || 30, enrolledCount: 0, status: status || "upcoming",
    });
    return NextResponse.json({ success: true, cohort }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create cohort" }, { status: 500 });
  }
}
