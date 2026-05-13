import { createClient } from "@supabase/supabase-js";
import { DEMO_INSTRUCTORS, DEMO_COHORTS, DEMO_ENROLLMENTS, DEMO_METRICS, DEMO_PROGRAM_PERFORMANCE, DEMO_COHORT_PERFORMANCE, DEMO_RISK_DISTRIBUTION, DEMO_PLATFORM_EVENTS, DEMO_CONTENT_QUALITY, DEMO_ADMIN_SETTINGS } from "@/lib/data/demoAdmin";
import { Instructor } from "@/lib/models/instructor.model";
import { Cohort } from "@/lib/models/cohort.model";
import { Enrollment } from "@/lib/models/enrollment.model";
import { AdminSettings } from "@/lib/models/admin.model";
import { ContentQualityReview } from "@/lib/models/content-quality.model";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || url.includes("demo-project") || !key || key.includes("demo_")) return null;
  try { return createClient(url, key); } catch { return null; }
}

export async function getInstructors(): Promise<Instructor[]> {
  const client = getClient();
  if (!client) return DEMO_INSTRUCTORS;
  const { data, error } = await client.from("instructors").select("*").order("created_at", { ascending: false });
  if (error || !data?.length) return DEMO_INSTRUCTORS;
  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string, name: r.name as string, email: r.email as string,
    expertise: (r.expertise as string[]) || [], bio: r.bio as string | undefined,
    assignedCourses: (r.assigned_courses as number) || 0, rating: (r.rating as number) || 0,
    status: (r.status as Instructor["status"]) || "active", createdAt: r.created_at as string,
  }));
}

export async function createInstructor(data: Omit<Instructor, "id" | "createdAt">): Promise<Instructor> {
  const client = getClient();
  if (!client) return { id: `demo-${Date.now()}`, ...data };
  const { data: row, error } = await client.from("instructors").insert({
    name: data.name, email: data.email, expertise: data.expertise, bio: data.bio,
    assigned_courses: data.assignedCourses || 0, rating: data.rating || 0, status: data.status || "active",
  }).select().single();
  if (error) throw new Error(error.message);
  return { id: row.id, name: row.name, email: row.email, expertise: row.expertise || [], bio: row.bio, assignedCourses: row.assigned_courses || 0, rating: row.rating || 0, status: row.status };
}

export async function getCohorts(): Promise<Cohort[]> {
  const client = getClient();
  if (!client) return DEMO_COHORTS;
  const { data, error } = await client.from("cohorts").select("*").order("created_at", { ascending: false });
  if (error || !data?.length) return DEMO_COHORTS;
  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string, name: r.name as string, programId: r.program_id as string | undefined,
    instructorId: r.instructor_id as string | undefined, startDate: r.start_date as string | undefined,
    endDate: r.end_date as string | undefined, capacity: (r.capacity as number) || 30,
    enrolledCount: (r.enrolled_count as number) || 0, status: (r.status as Cohort["status"]) || "upcoming",
  }));
}

export async function createCohort(data: Omit<Cohort, "id" | "createdAt">): Promise<Cohort> {
  const client = getClient();
  if (!client) return { id: `demo-${Date.now()}`, ...data };
  const { data: row, error } = await client.from("cohorts").insert({
    name: data.name, program_id: data.programId, instructor_id: data.instructorId,
    start_date: data.startDate, end_date: data.endDate, capacity: data.capacity || 30,
    enrolled_count: 0, status: data.status || "upcoming",
  }).select().single();
  if (error) throw new Error(error.message);
  return { id: row.id, name: row.name, programId: row.program_id, instructorId: row.instructor_id, startDate: row.start_date, endDate: row.end_date, capacity: row.capacity, enrolledCount: 0, status: row.status };
}

export async function getEnrollments(): Promise<Enrollment[]> {
  const client = getClient();
  if (!client) return DEMO_ENROLLMENTS;
  const { data, error } = await client.from("enrollments").select("*").order("enrolled_at", { ascending: false });
  if (error || !data?.length) return DEMO_ENROLLMENTS;
  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string, studentId: r.student_id as string, courseId: r.course_id as string,
    cohortId: r.cohort_id as string | undefined, enrollmentStatus: (r.enrollment_status as Enrollment["enrollmentStatus"]) || "active",
    paymentStatus: (r.payment_status as Enrollment["paymentStatus"]) || "demo",
    progressPercent: (r.progress_percent as number) || 0, completionStatus: (r.completion_status as Enrollment["completionStatus"]) || "not_started",
    enrolledAt: r.enrolled_at as string,
  }));
}

export async function createEnrollment(data: Omit<Enrollment, "id" | "enrolledAt">): Promise<Enrollment> {
  const client = getClient();
  if (!client) return { id: `demo-${Date.now()}`, enrolledAt: new Date().toISOString(), ...data };
  const { data: row, error } = await client.from("enrollments").insert({
    student_id: data.studentId, course_id: data.courseId, cohort_id: data.cohortId,
    enrollment_status: data.enrollmentStatus || "active", payment_status: data.paymentStatus || "demo",
    progress_percent: 0, completion_status: "not_started",
  }).select().single();
  if (error) throw new Error(error.message);
  return { id: row.id, studentId: row.student_id, courseId: row.course_id, cohortId: row.cohort_id, enrollmentStatus: row.enrollment_status, paymentStatus: row.payment_status, progressPercent: 0, completionStatus: "not_started", enrolledAt: row.enrolled_at };
}

export async function getContentQualityReviews(): Promise<ContentQualityReview[]> {
  const client = getClient();
  if (!client) return DEMO_CONTENT_QUALITY;
  const { data, error } = await client.from("content_quality_reviews").select("*").order("created_at", { ascending: false });
  if (error || !data?.length) return DEMO_CONTENT_QUALITY;
  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string, courseId: r.course_id as string, lectureId: r.lecture_id as string | undefined,
    quizId: r.quiz_id as string | undefined, qualityScore: (r.quality_score as number) || 0,
    issueType: r.issue_type as ContentQualityReview["issueType"], recommendation: r.recommendation as string,
    status: (r.status as ContentQualityReview["status"]) || "open", createdAt: r.created_at as string,
  }));
}

export async function updateContentQualityStatus(id: string, status: ContentQualityReview["status"]): Promise<boolean> {
  const client = getClient();
  if (!client) return true;
  const { error } = await client.from("content_quality_reviews").update({ status }).eq("id", id);
  return !error;
}

export async function getAdminSettings(): Promise<AdminSettings> {
  const client = getClient();
  if (!client) return DEMO_ADMIN_SETTINGS;
  const { data, error } = await client.from("admin_settings").select("*");
  if (error || !data?.length) return DEMO_ADMIN_SETTINGS;
  const map: Record<string, unknown> = {};
  data.forEach((row: { setting_key: string; setting_value: unknown }) => { map[row.setting_key] = row.setting_value; });
  return {
    platformName: (map.platform_name as string) || DEMO_ADMIN_SETTINGS.platformName,
    defaultQuizPassingScore: (map.default_quiz_passing_score as number) || 60,
    adaptiveQuizEnabled: (map.adaptive_quiz_enabled as boolean) ?? true,
    aiRecommendationsEnabled: (map.ai_recommendations_enabled as boolean) ?? true,
    geminiFeedbackEnabled: (map.gemini_feedback_enabled as boolean) ?? true,
    demoModeEnabled: (map.demo_mode_enabled as boolean) ?? true,
    minimumCompletionThreshold: (map.minimum_completion_threshold as number) || 70,
    highRiskScoreThreshold: (map.high_risk_score_threshold as number) || 50,
    mediumRiskScoreThreshold: (map.medium_risk_score_threshold as number) || 65,
  };
}

export async function updateAdminSettings(settings: Partial<AdminSettings>): Promise<boolean> {
  const client = getClient();
  if (!client) return true;
  const updates = [
    { setting_key: "platform_name", setting_value: settings.platformName },
    { setting_key: "default_quiz_passing_score", setting_value: settings.defaultQuizPassingScore },
    { setting_key: "adaptive_quiz_enabled", setting_value: settings.adaptiveQuizEnabled },
    { setting_key: "ai_recommendations_enabled", setting_value: settings.aiRecommendationsEnabled },
    { setting_key: "demo_mode_enabled", setting_value: settings.demoModeEnabled },
    { setting_key: "minimum_completion_threshold", setting_value: settings.minimumCompletionThreshold },
    { setting_key: "high_risk_score_threshold", setting_value: settings.highRiskScoreThreshold },
    { setting_key: "medium_risk_score_threshold", setting_value: settings.mediumRiskScoreThreshold },
  ].filter((u) => u.setting_value !== undefined);
  for (const update of updates) {
    await client.from("admin_settings").upsert({ setting_key: update.setting_key, setting_value: update.setting_value, updated_at: new Date().toISOString() }, { onConflict: "setting_key" });
  }
  return true;
}

export { DEMO_METRICS, DEMO_PROGRAM_PERFORMANCE, DEMO_COHORT_PERFORMANCE, DEMO_RISK_DISTRIBUTION, DEMO_PLATFORM_EVENTS };
