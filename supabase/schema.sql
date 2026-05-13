-- Atom Adaptive Intelligence Hub - Supabase Schema
-- Run this in your Supabase SQL editor

-- 1. Students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE,
  input_text text,
  skill_level text,
  primary_goal text,
  learning_style text,
  confidence_score int,
  preferred_course text,
  career_readiness_score int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 2. Course recommendations
CREATE TABLE IF NOT EXISTS course_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  course_api_id int,
  title text,
  description text,
  similarity_score int,
  rank int,
  created_at timestamptz DEFAULT now()
);

-- 3. Quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  history jsonb,
  next_difficulty text,
  accuracy int,
  weighted_score int,
  message text,
  created_at timestamptz DEFAULT now()
);

-- 4. Learning roadmaps
CREATE TABLE IF NOT EXISTS learning_roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  roadmap_title text,
  summary text,
  next_best_lesson text,
  weak_topic text,
  career_readiness_score int,
  roadmap jsonb,
  mentor_message text,
  instructor_note text,
  model_used text,
  created_at timestamptz DEFAULT now()
);

-- 5. Instructor insights
CREATE TABLE IF NOT EXISTS instructor_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  risk_level text,
  weak_topic text,
  recommended_action text,
  created_at timestamptz DEFAULT now()
);

-- 6. Admin metrics
CREATE TABLE IF NOT EXISTS admin_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text,
  metric_value text,
  created_at timestamptz DEFAULT now()
);

-- RLS Policies (optional, enable if using auth)
-- ALTER TABLE students ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE course_recommendations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE learning_roadmaps ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_course_recs_student ON course_recommendations(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_student ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_student ON learning_roadmaps(student_id);
CREATE INDEX IF NOT EXISTS idx_insight_student ON instructor_insights(student_id);
