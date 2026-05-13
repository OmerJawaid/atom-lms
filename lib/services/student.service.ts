import { Student } from "@/lib/models/student.model";
import { DEMO_STUDENTS } from "@/lib/data/demoStudents";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || url.includes("demo-project") || !key || key.includes("demo_")) return null;
  try {
    const { createClient } = require("@supabase/supabase-js");
    return createClient(url, key);
  } catch { return null; }
}

export async function getStudents(): Promise<Student[]> {
  const client = getClient();
  if (!client) return DEMO_STUDENTS;
  const { data, error } = await client.from("students").select("*").order("created_at", { ascending: false });
  if (error || !data?.length) return DEMO_STUDENTS;
  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string, name: r.name as string, email: r.email as string,
    inputText: r.input_text as string | undefined, skillLevel: r.skill_level as Student["skillLevel"],
    primaryGoal: r.primary_goal as string | undefined, learningStyle: r.learning_style as string | undefined,
    confidenceScore: r.confidence_score as number | undefined,
    preferredCourse: r.preferred_course as string | undefined,
    careerReadinessScore: r.career_readiness_score as number | undefined,
    createdAt: r.created_at as string | undefined,
  }));
}

export async function getStudentById(id: string): Promise<Student | null> {
  const client = getClient();
  if (!client) return DEMO_STUDENTS.find((s) => s.id === id) || null;
  const { data, error } = await client.from("students").select("*").eq("id", id).single();
  if (error || !data) return DEMO_STUDENTS.find((s) => s.id === id) || null;
  return {
    id: data.id, name: data.name, email: data.email,
    inputText: data.input_text, skillLevel: data.skill_level, primaryGoal: data.primary_goal,
    learningStyle: data.learning_style, confidenceScore: data.confidence_score,
    preferredCourse: data.preferred_course, careerReadinessScore: data.career_readiness_score,
    createdAt: data.created_at,
  };
}
