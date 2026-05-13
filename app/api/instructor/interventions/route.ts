import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || url.includes("demo-project") || !key) return null;
  try { return createClient(url, key); } catch { return null; }
}

export async function GET() {
  const client = getClient();
  if (!client) {
    return NextResponse.json({ success: true, interventions: DEMO_INTERVENTIONS });
  }
  const { data, error } = await client.from("instructor_interventions").select("*").order("created_at", { ascending: false }).limit(50);
  if (error) return NextResponse.json({ success: true, interventions: DEMO_INTERVENTIONS });
  return NextResponse.json({ success: true, interventions: data });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = getClient();
    if (!client) return NextResponse.json({ success: true, intervention: { id: "demo", ...body, status: "pending", createdAt: new Date().toISOString() } });
    const { data, error } = await client.from("instructor_interventions").insert({
      student_id: body.studentId,
      course_id: body.courseId,
      weak_topic: body.weakTopic,
      risk_level: body.riskLevel || "medium",
      recommended_action: body.recommendedAction,
      reason: body.reason,
      timeline: body.timeline || "1 week",
      status: "pending",
    }).select().single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, intervention: data });
  } catch (err) {
    console.error("[api/instructor/interventions] POST error:", err);
    return NextResponse.json({ success: false, error: "Failed to create intervention" }, { status: 500 });
  }
}

const DEMO_INTERVENTIONS = [
  { id: "i1", studentId: "s1000000-0000-0000-0000-000000000003", courseId: "c1000000-0000-0000-0000-000000000001", weakTopic: "Hypothesis Testing", riskLevel: "high", recommendedAction: "Schedule 1:1 tutoring session on statistics fundamentals", reason: "Scored below 40% on 3 consecutive stats quizzes", timeline: "This week", status: "pending", created_at: new Date().toISOString() },
  { id: "i2", studentId: "s1000000-0000-0000-0000-000000000005", courseId: "c2000000-0000-0000-0000-000000000002", weakTopic: "Backpropagation", riskLevel: "medium", recommendedAction: "Send supplementary reading on neural network math", reason: "Consistently misses gradient descent questions", timeline: "2 days", status: "completed", created_at: new Date().toISOString() },
];
