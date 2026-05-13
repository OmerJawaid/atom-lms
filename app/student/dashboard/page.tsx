"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/cards/MetricCard";
import { StatusBadge } from "@/components/cards/StatusBadge";
import { RecommendationCard } from "@/components/cards/RecommendationCard";
import { InsightCard } from "@/components/cards/InsightCard";
import { SkillProgressChart } from "@/components/charts/SkillProgressChart";
import { QuizPerformanceChart } from "@/components/charts/QuizPerformanceChart";
import { Brain, Target, BookOpen, Zap, Map, MessageSquare, AlertCircle } from "lucide-react";
import Link from "next/link";
import { DEMO_STUDENTS } from "@/lib/data/demoStudents";
import { FALLBACK_RECOMMENDATIONS } from "@/lib/data/demoCourses";
import { DEMO_ROADMAPS } from "@/lib/data/demoAnalytics";

interface OnboardingData {
  studentId: string;
  student: { name: string; email: string };
  profile: { skillLevel: string; primaryGoal: string; learningStyle: string; confidenceScore: number; source: string };
  recommendations: Array<{ id: number; title: string; description: string; similarityScore: number }>;
  quiz: { nextDifficulty: string; accuracy: number; weightedScore: number; message: string; source: string };
  roadmap: { roadmapTitle: string; summary: string; nextBestLesson: string; weakTopic: string; careerReadinessScore: number; mentorMessage: string; modelUsed?: string };
  fallbackUsed: { modelApi: boolean; gemini: boolean; supabase: boolean };
}

function getDemoData(): OnboardingData {
  const s = DEMO_STUDENTS[0];
  const rm = DEMO_ROADMAPS["demo-student-1"];
  return {
    studentId: s.id,
    student: { name: s.name, email: s.email },
    profile: {
      skillLevel: s.skillLevel!,
      primaryGoal: s.primaryGoal!,
      learningStyle: s.learningStyle!,
      confidenceScore: s.confidenceScore!,
      source: "fallback",
    },
    recommendations: FALLBACK_RECOMMENDATIONS,
    quiz: { nextDifficulty: "medium", accuracy: 67, weightedScore: 50, message: "Good progress. Maintaining difficulty.", source: "fallback" },
    roadmap: { roadmapTitle: "Data Science Roadmap", summary: rm.instructorNote, nextBestLesson: "Pandas and Data Cleaning", weakTopic: rm.weakTopic, careerReadinessScore: rm.careerReadinessScore, mentorMessage: rm.mentorMessage },
    fallbackUsed: { modelApi: true, gemini: true, supabase: true },
  };
}

export default function StudentDashboardPage() {
  const [data, setData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("onboardingResult");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        setData(getDemoData());
      }
    } else {
      setData(getDemoData());
    }
  }, []);

  if (!data) return (
    <AppShell>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-[#008F11] border-t-transparent rounded-full" />
      </div>
    </AppShell>
  );

  const { student, profile, recommendations, quiz, roadmap, fallbackUsed } = data;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome + fallback badges */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {student.name}!</h1>
            <p className="text-gray-500 text-sm mt-1">Your AI-generated learning dashboard</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {fallbackUsed.modelApi && <StatusBadge label="Model API Fallback" status="warning" />}
            {fallbackUsed.gemini && <StatusBadge label="Gemini Fallback" status="warning" />}
            {fallbackUsed.supabase && <StatusBadge label="Demo Data Mode" status="neutral" />}
            {!fallbackUsed.modelApi && <StatusBadge label="Model API Live" status="success" />}
            {!fallbackUsed.gemini && <StatusBadge label="Gemini Live" status="success" />}
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Profile Confidence"
            value={`${profile.confidenceScore}%`}
            subtitle="AI profiling score"
            icon={Brain}
            tone={profile.confidenceScore >= 65 ? "success" : "warning"}
          />
          <MetricCard
            title="Top Match"
            value={recommendations[0]?.title || "N/A"}
            subtitle={`${recommendations[0]?.similarityScore}% match`}
            icon={BookOpen}
            tone="primary"
          />
          <MetricCard
            title="Quiz Accuracy"
            value={`${quiz.accuracy}%`}
            subtitle={`Next: ${quiz.nextDifficulty}`}
            icon={Zap}
            tone={quiz.accuracy >= 70 ? "success" : "warning"}
          />
          <MetricCard
            title="Career Readiness"
            value={`${roadmap.careerReadinessScore}%`}
            subtitle="Based on your path"
            icon={Target}
            tone={roadmap.careerReadinessScore >= 65 ? "success" : "warning"}
          />
        </div>

        {/* Profile + Quiz charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkillProgressChart
            skillLevel={profile.skillLevel}
            confidenceScore={profile.confidenceScore}
            quizAccuracy={quiz.accuracy}
            careerReadiness={roadmap.careerReadinessScore}
          />
          <QuizPerformanceChart accuracy={quiz.accuracy} weightedScore={quiz.weightedScore} />
        </div>

        {/* Profile details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-[#008F11]" />
            <h2 className="font-semibold text-gray-800">AI Learning Profile</h2>
            <StatusBadge label="AI Profiled" status="ai" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Skill Level", value: profile.skillLevel, capitalize: true },
              { label: "Primary Goal", value: profile.primaryGoal },
              { label: "Learning Style", value: profile.learningStyle },
              { label: "Next Difficulty", value: quiz.nextDifficulty, capitalize: true },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <p className={`text-sm font-semibold text-gray-800 ${item.capitalize ? "capitalize" : ""}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Course recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-[#008F11]" />
            <h2 className="font-semibold text-gray-800">AI Course Recommendations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((rec, i) => (
              <RecommendationCard
                key={rec.id}
                title={rec.title}
                description={rec.description}
                similarityScore={rec.similarityScore}
                rank={i + 1}
              />
            ))}
          </div>
        </div>

        {/* Insights row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard
            title="AI Mentor Message"
            content={roadmap.mentorMessage}
            icon={MessageSquare}
            variant="ai"
          />
          <InsightCard
            title="Weak Topic to Focus On"
            content={`Your identified weak area is: ${roadmap.weakTopic}. Spend extra time here before advancing.`}
            icon={AlertCircle}
            variant="warning"
          />
        </div>

        {/* Quiz result */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-[#008F11]" />
            <h3 className="font-semibold text-gray-800 text-sm">Adaptive Quiz Result</h3>
          </div>
          <p className="text-sm text-gray-600 bg-[#008F11]/5 rounded-lg p-3 border border-[#008F11]/10">
            💡 {quiz.message}
          </p>
        </div>

        {/* CTA Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "View Roadmap", href: "/student/roadmap", icon: Map, color: "bg-[#008F11] text-white hover:bg-[#006B0D]" },
            { label: "Take Quiz", href: "/student/quiz", icon: Brain, color: "bg-[#0B1F33] text-white hover:bg-[#123A5A]" },
            { label: "AI Mentor", href: "/student/mentor", icon: MessageSquare, color: "bg-blue-600 text-white hover:bg-blue-700" },
            { label: "New Onboarding", href: "/student/onboarding", icon: Zap, color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
          ].map((btn) => {
            const Icon = btn.icon;
            return (
              <Link
                key={btn.href}
                href={btn.href}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${btn.color}`}
              >
                <Icon className="w-4 h-4" />
                {btn.label}
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
