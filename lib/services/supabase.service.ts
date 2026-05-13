import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || url === "https://demo-project.supabase.co" || !key || key.includes("demo_")) {
    return null;
  }

  try {
    supabaseClient = createClient(url, key);
    return supabaseClient;
  } catch {
    return null;
  }
}

export function isSupabaseAvailable(): boolean {
  return getSupabaseClient() !== null;
}

export async function saveStudent(data: {
  name: string;
  email: string;
  inputText?: string;
  skillLevel?: string;
  primaryGoal?: string;
  learningStyle?: string;
  confidenceScore?: number;
  preferredCourse?: string;
  careerReadinessScore?: number;
}): Promise<{ id: string } | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data: student, error } = await client
      .from("students")
      .insert({
        name: data.name,
        email: data.email,
        input_text: data.inputText,
        skill_level: data.skillLevel,
        primary_goal: data.primaryGoal,
        learning_style: data.learningStyle,
        confidence_score: data.confidenceScore,
        preferred_course: data.preferredCourse,
        career_readiness_score: data.careerReadinessScore,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[supabase] saveStudent error:", error.message);
      return null;
    }
    return student;
  } catch (err) {
    console.error("[supabase] saveStudent exception:", err);
    return null;
  }
}

export async function saveRecommendations(
  studentId: string,
  recommendations: Array<{
    courseApiId: number;
    title: string;
    description: string;
    similarityScore: number;
    rank: number;
  }>
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from("course_recommendations").insert(
      recommendations.map((r) => ({
        student_id: studentId,
        course_api_id: r.courseApiId,
        title: r.title,
        description: r.description,
        similarity_score: r.similarityScore,
        rank: r.rank,
      }))
    );

    if (error) {
      console.error("[supabase] saveRecommendations error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[supabase] saveRecommendations exception:", err);
    return false;
  }
}

export async function saveQuizAttempt(data: {
  studentId: string;
  history: unknown[];
  nextDifficulty: string;
  accuracy: number;
  weightedScore: number;
  message: string;
}): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from("quiz_attempts").insert({
      student_id: data.studentId,
      history: data.history,
      next_difficulty: data.nextDifficulty,
      accuracy: data.accuracy,
      weighted_score: data.weightedScore,
      message: data.message,
    });

    if (error) {
      console.error("[supabase] saveQuizAttempt error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[supabase] saveQuizAttempt exception:", err);
    return false;
  }
}

export async function saveRoadmap(data: {
  studentId: string;
  roadmapTitle: string;
  summary: string;
  nextBestLesson: string;
  weakTopic: string;
  careerReadinessScore: number;
  roadmap: unknown[];
  mentorMessage: string;
  instructorNote: string;
  modelUsed?: string;
}): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from("learning_roadmaps").insert({
      student_id: data.studentId,
      roadmap_title: data.roadmapTitle,
      summary: data.summary,
      next_best_lesson: data.nextBestLesson,
      weak_topic: data.weakTopic,
      career_readiness_score: data.careerReadinessScore,
      roadmap: data.roadmap,
      mentor_message: data.mentorMessage,
      instructor_note: data.instructorNote,
      model_used: data.modelUsed || "fallback",
    });

    if (error) {
      console.error("[supabase] saveRoadmap error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[supabase] saveRoadmap exception:", err);
    return false;
  }
}

export async function getStudents(): Promise<unknown[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[supabase] getStudents error:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("[supabase] getStudents exception:", err);
    return null;
  }
}

export async function getRoadmaps(): Promise<unknown[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("learning_roadmaps")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[supabase] getRoadmaps error:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("[supabase] getRoadmaps exception:", err);
    return null;
  }
}

export async function getQuizAttempts(): Promise<unknown[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("quiz_attempts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[supabase] getQuizAttempts error:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("[supabase] getQuizAttempts exception:", err);
    return null;
  }
}
