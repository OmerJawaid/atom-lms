-- Atom Adaptive Intelligence Hub - Complete Schema
-- Run this in Supabase SQL Editor

create extension if not exists "pgcrypto";

-- ============================================================
-- CORE TABLES
-- ============================================================

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,
  input_text text,
  skill_level text,
  primary_goal text,
  learning_style text,
  confidence_score int default 0,
  preferred_course_id uuid,
  career_readiness_score int default 0,
  created_at timestamptz default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  track text not null,
  level text not null,
  duration text,
  description text,
  thumbnail_url text,
  is_published boolean default true,
  created_at timestamptz default now()
);

create table if not exists lectures (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  content text,
  video_url text,
  duration_minutes int default 20,
  order_index int default 1,
  lecture_type text default 'video',
  is_published boolean default true,
  created_at timestamptz default now()
);

create table if not exists quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  lecture_id uuid references lectures(id) on delete set null,
  title text not null,
  description text,
  difficulty text default 'medium',
  passing_score int default 60,
  time_limit_minutes int default 15,
  is_adaptive boolean default true,
  is_published boolean default true,
  created_at timestamptz default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references quizzes(id) on delete cascade,
  question_text text not null,
  question_type text default 'mcq',
  options jsonb not null,
  correct_answer text not null,
  explanation text,
  difficulty text default 'medium',
  topic text,
  points int default 1,
  order_index int default 1,
  created_at timestamptz default now()
);

create table if not exists lecture_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  lecture_id uuid references lectures(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  status text default 'not_started',
  progress_percent int default 0,
  completed_at timestamptz,
  created_at timestamptz default now(),
  unique(student_id, lecture_id)
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  quiz_id uuid references quizzes(id) on delete cascade,
  lecture_id uuid references lectures(id) on delete set null,
  answers jsonb not null default '[]',
  score int default 0,
  total_questions int default 0,
  correct_count int default 0,
  accuracy int default 0,
  weighted_score int default 0,
  next_difficulty text,
  passed boolean default false,
  ai_feedback text,
  weak_topics jsonb default '[]',
  started_at timestamptz default now(),
  submitted_at timestamptz default now()
);

create table if not exists course_recommendations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  course_api_id int,
  title text,
  description text,
  similarity_score int,
  rank int,
  created_at timestamptz default now()
);

create table if not exists learning_roadmaps (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  roadmap_title text,
  summary text,
  next_best_lesson text,
  weak_topic text,
  career_readiness_score int,
  roadmap jsonb,
  mentor_message text,
  instructor_note text,
  model_used text,
  created_at timestamptz default now()
);

create table if not exists instructor_interventions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  weak_topic text,
  risk_level text,
  recommended_action text,
  reason text,
  timeline text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_lectures_course on lectures(course_id);
create index if not exists idx_quizzes_course on quizzes(course_id);
create index if not exists idx_quizzes_lecture on quizzes(lecture_id);
create index if not exists idx_questions_quiz on questions(quiz_id);
create index if not exists idx_progress_student on lecture_progress(student_id);
create index if not exists idx_progress_lecture on lecture_progress(lecture_id);
create index if not exists idx_attempts_student on quiz_attempts(student_id);
create index if not exists idx_attempts_quiz on quiz_attempts(quiz_id);
create index if not exists idx_interventions_student on instructor_interventions(student_id);
