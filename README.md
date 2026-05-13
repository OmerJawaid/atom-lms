# Atom Adaptive Intelligence Hub

> Smart Adaptive LMS for atomcamp — Hackathon 2025

## Problem Summary

Traditional LMS platforms treat all learners the same. Students drop off because courses do not match their skill level, learning style, or goals. Instructors have no visibility into which students are struggling or why.

## Solution Overview

Atom Adaptive Intelligence Hub is an AI-powered LMS layer that:
- **Profiles** learners from natural language using an external AI API
- **Recommends** the best courses using semantic matching
- **Adapts** quiz difficulty in real-time based on performance
- **Generates** personalized roadmaps using Google Gemini
- **Alerts** instructors about at-risk students
- **Shows** admins platform-wide analytics

## Features

| Feature | Powered By |
|---------|-----------|
| Learner profiling from text | External ngrok AI API /profile |
| Course recommendation | External ngrok AI API /recommend |
| Adaptive quiz difficulty | External ngrok AI API /quiz |
| Personalized roadmap generation | Google Gemini |
| AI Mentor chat | Google Gemini |
| At-risk student detection | Analytics service |
| Admin analytics dashboard | Supabase + fallback |
| Data persistence | Supabase |
| Demo fallback | Local JSON data |

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS
- Supabase (PostgreSQL)
- Google Gemini (@google/genai)
- Recharts for visualizations
- Lucide React for icons
- Zod for validation

## AI Architecture

```
User Input (text)
       |
       v
External ngrok AI API
  POST /profile  -> skill level, learning style, confidence
  POST /recommend -> course matches with similarity scores
  POST /quiz -> next difficulty, accuracy, weighted score
       |
       v
Google Gemini
  Roadmap generation (structured JSON)
  Mentor advice (conversational)
  Fallback: deterministic fallback-ai.service.ts
       |
       v
Supabase
  students, course_recommendations, quiz_attempts
  learning_roadmaps, instructor_insights
       |
       v
Fallback Layer (if any service fails)
  Demo data, fallback roadmaps, no crashes
```

## External API Integration (ngrok)

Base URL: https://cussed-pope-ripeness.ngrok-free.dev

All requests require: ngrok-skip-browser-warning: true header.

Test commands:

```bash
curl -X POST "$MODEL_API_BASE_URL/profile" \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{"text":"I am a CS graduate who wants to learn machine learning"}'

curl -X POST "$MODEL_API_BASE_URL/recommend" \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{"text":"I want to learn data science"}'

curl -X POST "$MODEL_API_BASE_URL/quiz" \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{"history":[{"question_id":1,"difficulty":"medium","correct":true},{"question_id":2,"difficulty":"medium","correct":true},{"question_id":3,"difficulty":"medium","correct":false}]}'
```

## Gemini Usage

Gemini is used after the ngrok API runs:

1. Roadmap generation: Takes profile + recommendations + quiz result, returns structured 5-week roadmap
2. Mentor advice: Answers student questions about weak topics, next steps, improvement strategies
3. Fallback mode: If Gemini fails, fallback-ai.service.ts generates roadmaps from goal keywords

## Supabase Schema

Tables:
- students: learner profiles
- course_recommendations: AI course matches per student
- quiz_attempts: adaptive quiz history
- learning_roadmaps: Gemini-generated roadmaps
- instructor_insights: risk analysis
- admin_metrics: platform metrics

## MVC Architecture

```
app/api/          <- Routes (HTTP layer)
lib/controllers/  <- Business logic (validate -> call services -> return data)
lib/services/     <- External integrations (ngrok API, Gemini, Supabase)
lib/models/       <- TypeScript types
lib/data/         <- Demo/fallback data
components/       <- React UI components
```

## Folder Structure

```
atom-lms/
  app/
    page.tsx                    # Landing page
    student/
      onboarding/page.tsx       # AI onboarding form
      dashboard/page.tsx        # Student dashboard
      roadmap/page.tsx          # Learning roadmap
      quiz/page.tsx             # Adaptive quiz
      mentor/page.tsx           # AI mentor chat
    instructor/dashboard/       # At-risk learners view
    admin/dashboard/            # Platform analytics
    api/                        # Server-side routes
  components/
    layout/                     # AppShell, Sidebar, Topbar, RoleSwitcher
    cards/                      # MetricCard, RecommendationCard, etc.
    charts/                     # Recharts wrappers
    student/                    # OnboardingForm, RoadmapTimeline, etc.
    instructor/                 # AtRiskStudentsTable, InterventionPanel
    admin/                      # AdminMetricGrid
  lib/
    models/                     # TypeScript interfaces
    controllers/                # Business logic layer
    services/                   # model-api, gemini, supabase, fallback
    data/                       # Demo data
    utils/                      # cn, score, validators
  supabase/
    schema.sql                  # Database schema
    seed.sql                    # Demo seed data
  .env.local                    # Environment variables
```

## Setup Commands

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your real API keys
npm run dev
# Open http://localhost:3000
```

## Environment Variables

```
# Supabase - get from supabase.com -> Settings -> API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Gemini - get from aistudio.google.com
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# External AI API (pre-configured)
MODEL_API_BASE_URL=https://cussed-pope-ripeness.ngrok-free.dev
```

## Supabase Setup

1. Create a new project at supabase.com
2. Go to Settings -> API -> copy Project URL and anon key
3. Copy service role key (server-side only)
4. Open SQL Editor -> run supabase/schema.sql
5. Run supabase/seed.sql for demo data
6. Update .env.local with real values

## Demo Flow (3 minutes)

1. Open http://localhost:3000 - see API status badges
2. Click "Start Demo Now" -> Student Onboarding
3. Fill in: "I am a beginner and I want to learn data science and machine learning through practical projects."
4. Submit -> AI calls /profile, /recommend, /quiz, then Gemini
5. View Student Dashboard - skill level, top courses, quiz result, career readiness
6. Click "View Roadmap" -> see AI-generated 5-week plan with AI Recommended module highlighted
7. Click "Take Adaptive Quiz" -> toggle answers, click Adapt -> see difficulty change
8. Click "AI Mentor" -> ask "What should I study next?"
9. Switch to Instructor Dashboard -> at-risk students table + weak topic heatmap
10. Switch to Admin Dashboard -> platform analytics + course performance chart

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/profile | Profile student from text |
| POST | /api/recommend | Get course recommendations |
| POST | /api/quiz | Adapt quiz difficulty |
| POST | /api/onboarding | Full onboarding pipeline |
| GET | /api/students | List all students |
| GET | /api/instructor-insights | At-risk analysis |
| GET | /api/admin-analytics | Platform metrics |
| GET | /api/health/model-api | API health check |
| POST | /api/mentor | AI mentor response |

## Fallback Mode

The app never crashes:

| Service Failure | Fallback |
|----------------|---------|
| ngrok API down | Returns demo profile/recommendations/quiz |
| Gemini API down | Returns keyword-based roadmap from fallback-ai.service.ts |
| Supabase down | Uses demo students from demoStudents.ts |

## Troubleshooting

**App shows "Model API Fallback"**
Update MODEL_API_BASE_URL in .env.local if the ngrok URL changed.

**Gemini not working**
Check GEMINI_API_KEY is set correctly. Must be a valid Google AI Studio key.

**Supabase showing "Demo Data Mode"**
Run schema.sql first, then update env vars with real Supabase credentials.

**Build fails**
Run npm install to ensure all dependencies are installed.
