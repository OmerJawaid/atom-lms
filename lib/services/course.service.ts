import { Course, DEMO_COURSES } from "@/lib/models/course.model";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || url.includes("demo-project") || !key || key.includes("demo_")) return null;
  try { return createClient(url, key); } catch { return null; }
}

function mapRow(row: Record<string, unknown>): Course {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    track: row.track as string,
    level: row.level as string,
    duration: row.duration as string | undefined,
    description: row.description as string | undefined,
    thumbnailUrl: row.thumbnail_url as string | undefined,
    isPublished: row.is_published as boolean,
    createdAt: row.created_at as string | undefined,
  };
}

export async function getCourses(): Promise<Course[]> {
  const client = getClient();
  if (!client) return DEMO_COURSES;
  const { data, error } = await client.from("courses").select("*").eq("is_published", true).order("created_at");
  if (error || !data?.length) return DEMO_COURSES;
  return data.map(mapRow);
}

export async function getCourseById(id: string): Promise<Course | null> {
  const client = getClient();
  if (!client) return DEMO_COURSES.find((c) => c.id === id) ?? null;
  const { data, error } = await client.from("courses").select("*").eq("id", id).single();
  if (error || !data) return DEMO_COURSES.find((c) => c.id === id) ?? null;
  return mapRow(data);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const client = getClient();
  if (!client) return DEMO_COURSES.find((c) => c.slug === slug) ?? null;
  const { data, error } = await client.from("courses").select("*").eq("slug", slug).single();
  if (error || !data) return DEMO_COURSES.find((c) => c.slug === slug) ?? null;
  return mapRow(data);
}
