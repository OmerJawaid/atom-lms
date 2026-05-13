import { Lecture, LectureProgress } from "@/lib/models/lecture.model";
import { DEMO_LECTURES, getLecturesByCourse, getLectureById as getDemoLectureById } from "@/lib/data/demoLectures";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || url.includes("demo-project") || !key || key.includes("demo_")) return null;
  try { return createClient(url, key); } catch { return null; }
}

function mapLecture(row: Record<string, unknown>): Lecture {
  return {
    id: row.id as string,
    courseId: row.course_id as string,
    title: row.title as string,
    slug: row.slug as string,
    description: row.description as string | undefined,
    content: row.content as string | undefined,
    videoUrl: row.video_url as string | undefined,
    durationMinutes: (row.duration_minutes as number) || 20,
    orderIndex: (row.order_index as number) || 1,
    lectureType: (row.lecture_type as Lecture["lectureType"]) || "video",
    isPublished: row.is_published as boolean,
    createdAt: row.created_at as string | undefined,
  };
}

function mapProgress(row: Record<string, unknown>): LectureProgress {
  return {
    id: row.id as string,
    studentId: row.student_id as string,
    lectureId: row.lecture_id as string,
    courseId: row.course_id as string,
    status: row.status as LectureProgress["status"],
    progressPercent: (row.progress_percent as number) || 0,
    completedAt: row.completed_at as string | undefined,
    createdAt: row.created_at as string | undefined,
  };
}

export async function getLecturesByCourseId(courseId: string): Promise<Lecture[]> {
  const client = getClient();
  if (!client) return getLecturesByCourse(courseId);
  const { data, error } = await client.from("lectures").select("*").eq("course_id", courseId).eq("is_published", true).order("order_index");
  if (error || !data?.length) return getLecturesByCourse(courseId);
  return data.map(mapLecture);
}

export async function getLectureById(id: string): Promise<Lecture | null> {
  const client = getClient();
  if (!client) return getDemoLectureById(id) ?? null;
  const { data, error } = await client.from("lectures").select("*").eq("id", id).single();
  if (error || !data) return getDemoLectureById(id) ?? null;
  return mapLecture(data);
}

export async function getLectureProgress(studentId: string, lectureId: string): Promise<LectureProgress | null> {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client.from("lecture_progress").select("*").eq("student_id", studentId).eq("lecture_id", lectureId).single();
  if (error || !data) return null;
  return mapProgress(data);
}

export async function getProgressByCourse(studentId: string, courseId: string): Promise<LectureProgress[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client.from("lecture_progress").select("*").eq("student_id", studentId).eq("course_id", courseId);
  if (error || !data) return [];
  return data.map(mapProgress);
}

export async function markLectureComplete(studentId: string, lectureId: string, courseId: string): Promise<LectureProgress | null> {
  const client = getClient();
  if (!client) {
    return { id: "demo", studentId, lectureId, courseId, status: "completed", progressPercent: 100, completedAt: new Date().toISOString() };
  }
  const { data, error } = await client.from("lecture_progress").upsert({
    student_id: studentId,
    lecture_id: lectureId,
    course_id: courseId,
    status: "completed",
    progress_percent: 100,
    completed_at: new Date().toISOString(),
  }, { onConflict: "student_id,lecture_id" }).select().single();
  if (error) { console.error("[lecture] markComplete error:", error.message); return null; }
  return mapProgress(data);
}

export async function getAllLectures(): Promise<Lecture[]> {
  const client = getClient();
  if (!client) return DEMO_LECTURES;
  const { data, error } = await client.from("lectures").select("*").order("course_id").order("order_index");
  if (error || !data?.length) return DEMO_LECTURES;
  return data.map(mapLecture);
}
