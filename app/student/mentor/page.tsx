"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AIMentorPanel } from "@/components/student/AIMentorPanel";
import { Brain, AlertCircle, BookOpen, Target } from "lucide-react";

interface SessionData {
  profile?: { skillLevel: string; primaryGoal: string; learningStyle: string; confidenceScore: number };
  recommendations?: Array<{ title: string }>;
  roadmap?: { weakTopic: string; careerReadinessScore: number };
  quiz?: { accuracy: number };
}

export default function MentorPage() {
  const [sessionData, setSessionData] = useState<SessionData>({});

  useEffect(() => {
    const stored = sessionStorage.getItem("onboardingResult");
    if (stored) {
      try {
        setSessionData(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  const profile = sessionData.profile || {
    skillLevel: "beginner",
    primaryGoal: "data science and machine learning",
    learningStyle: "hands-on practical learner",
    confidenceScore: 60,
  };
  const topCourse = sessionData.recommendations?.[0]?.title || "Data Science Bootcamp";
  const weakTopic = sessionData.roadmap?.weakTopic || "Machine Learning Foundations";
  const quizAccuracy = sessionData.quiz?.accuracy || 67;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-5 h-5 text-[#008F11]" />
            <h1 className="text-2xl font-bold text-gray-900">AI Learning Mentor</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Powered by Google Gemini — personalized guidance based on your profile and roadmap
          </p>
        </div>

        {/* Context cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-3.5 h-3.5 text-[#008F11]" />
              <p className="text-xs text-gray-400">Your Goal</p>
            </div>
            <p className="text-sm font-semibold text-gray-800 capitalize">{profile.primaryGoal}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <p className="text-xs text-gray-400">Top Course</p>
            </div>
            <p className="text-sm font-semibold text-gray-800">{topCourse}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-yellow-500" />
              <p className="text-xs text-gray-400">Weak Topic</p>
            </div>
            <p className="text-sm font-semibold text-gray-800">{weakTopic}</p>
          </div>
        </div>

        {/* Mentor chat */}
        <div style={{ height: "600px" }} className="flex flex-col">
          <AIMentorPanel
            profile={profile}
            topCourse={topCourse}
            weakTopic={weakTopic}
            quizAccuracy={quizAccuracy}
          />
        </div>
      </div>
    </AppShell>
  );
}
