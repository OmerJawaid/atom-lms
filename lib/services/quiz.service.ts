import { QuizMeta, DEMO_QUIZZES, getQuizById as getDemoQuizById, getQuizzesByCourse as getDemoQuizzesByCourse } from "@/lib/data/demoQuizzes";
import { Question } from "@/lib/models/question.model";
import { QuizAttempt, AnswerRecord } from "@/lib/models/attempt.model";
import { DEMO_QUESTIONS, getQuestionsByQuiz as getDemoQuestionsByQuiz } from "@/lib/data/demoQuestions";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || url.includes("demo-project") || !key || key.includes("demo_")) return null;
  try { return createClient(url, key); } catch { return null; }
}

function mapQuiz(row: Record<string, unknown>): QuizMeta {
  return {
    id: row.id as string,
    courseId: row.course_id as string,
    lectureId: row.lecture_id as string | undefined,
    title: row.title as string,
    description: row.description as string | undefined,
    difficulty: (row.difficulty as QuizMeta["difficulty"]) || "medium",
    passingScore: (row.passing_score as number) || 60,
    timeLimitMinutes: (row.time_limit_minutes as number) || 15,
    isAdaptive: row.is_adaptive as boolean,
    isPublished: row.is_published as boolean,
  };
}

function mapQuestion(row: Record<string, unknown>): Question {
  return {
    id: row.id as string,
    quizId: row.quiz_id as string,
    questionText: row.question_text as string,
    questionType: (row.question_type as Question["questionType"]) || "mcq",
    options: row.options as Question["options"],
    correctAnswer: row.correct_answer as string,
    explanation: row.explanation as string | undefined,
    difficulty: (row.difficulty as Question["difficulty"]) || "medium",
    topic: row.topic as string | undefined,
    points: (row.points as number) || 1,
    orderIndex: (row.order_index as number) || 1,
    createdAt: row.created_at as string | undefined,
  };
}

function mapAttempt(row: Record<string, unknown>): QuizAttempt {
  return {
    id: row.id as string,
    studentId: row.student_id as string,
    quizId: row.quiz_id as string,
    lectureId: row.lecture_id as string | undefined,
    answers: (row.answers as AnswerRecord[]) || [],
    score: (row.score as number) || 0,
    totalQuestions: (row.total_questions as number) || 0,
    correctCount: (row.correct_count as number) || 0,
    accuracy: (row.accuracy as number) || 0,
    weightedScore: (row.weighted_score as number) || 0,
    nextDifficulty: row.next_difficulty as QuizAttempt["nextDifficulty"],
    passed: (row.passed as boolean) || false,
    aiFeedback: row.ai_feedback as string | undefined,
    weakTopics: (row.weak_topics as string[]) || [],
    startedAt: row.started_at as string,
    submittedAt: row.submitted_at as string,
  };
}

export async function getQuizzesByCourse(courseId: string): Promise<QuizMeta[]> {
  const client = getClient();
  if (!client) return getDemoQuizzesByCourse(courseId);
  const { data, error } = await client.from("quizzes").select("*").eq("course_id", courseId).eq("is_published", true);
  if (error || !data?.length) return getDemoQuizzesByCourse(courseId);
  return data.map(mapQuiz);
}

export async function getQuizById(id: string): Promise<QuizMeta | null> {
  const client = getClient();
  if (!client) return getDemoQuizById(id) ?? null;
  const { data, error } = await client.from("quizzes").select("*").eq("id", id).single();
  if (error || !data) return getDemoQuizById(id) ?? null;
  return mapQuiz(data);
}

export async function getQuestionsByQuiz(quizId: string): Promise<Question[]> {
  const client = getClient();
  if (!client) return getDemoQuestionsByQuiz(quizId);
  const { data, error } = await client.from("questions").select("*").eq("quiz_id", quizId).order("order_index");
  if (error || !data?.length) return getDemoQuestionsByQuiz(quizId);
  return data.map(mapQuestion);
}

export async function saveQuizAttempt(attempt: Omit<QuizAttempt, "id">): Promise<QuizAttempt | null> {
  const client = getClient();
  if (!client) return { id: `demo-${Date.now()}`, ...attempt };
  const { data, error } = await client.from("quiz_attempts").insert({
    student_id: attempt.studentId,
    quiz_id: attempt.quizId,
    lecture_id: attempt.lectureId,
    answers: attempt.answers,
    score: attempt.score,
    total_questions: attempt.totalQuestions,
    correct_count: attempt.correctCount,
    accuracy: attempt.accuracy,
    weighted_score: attempt.weightedScore,
    next_difficulty: attempt.nextDifficulty,
    passed: attempt.passed,
    ai_feedback: attempt.aiFeedback,
    weak_topics: attempt.weakTopics,
    started_at: attempt.startedAt,
    submitted_at: attempt.submittedAt,
  }).select().single();
  if (error) { console.error("[quiz] saveAttempt error:", error.message); return null; }
  return mapAttempt(data);
}

export async function getAttemptsByStudent(studentId: string): Promise<QuizAttempt[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client.from("quiz_attempts").select("*").eq("student_id", studentId).order("submitted_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapAttempt);
}

export async function getAllAttempts(): Promise<QuizAttempt[]> {
  const client = getClient();
  if (!client) return [];
  const { data, error } = await client.from("quiz_attempts").select("*").order("submitted_at", { ascending: false }).limit(100);
  if (error || !data) return [];
  return data.map(mapAttempt);
}

export async function getAllQuizzes(): Promise<QuizMeta[]> {
  const client = getClient();
  if (!client) return DEMO_QUIZZES;
  const { data, error } = await client.from("quizzes").select("*").order("created_at");
  if (error || !data?.length) return DEMO_QUIZZES;
  return data.map(mapQuiz);
}

export async function getAllQuestions(): Promise<Question[]> {
  const client = getClient();
  if (!client) return DEMO_QUESTIONS;
  const { data, error } = await client.from("questions").select("*").order("created_at");
  if (error || !data?.length) return DEMO_QUESTIONS;
  return data.map(mapQuestion);
}
