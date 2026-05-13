"use client";

import { use, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Loader2, ArrowLeft, User, TrendingUp, ClipboardList } from "lucide-react";
import Link from "next/link";

interface LearnerDetail {
  student: {
    id: string; name: string; email: string; skillLevel?: string;
    primaryGoal?: string; learningStyle?: string;
    careerReadinessScore?: number; preferredCourse?: string; createdAt?: string;
  };
  attempts: {
    id: string; quizId: string; score: number; accuracy: number;
    passed: boolean; weakTopics: string[]; submittedAt: string;
  }[];
}

export default function AdminLearnerDetailPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = use(params);
  const [data, setData] = useState<LearnerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/learners/${studentId}`)
      .then((r) => r.json())
      .then((res) => { if (res.success) setData(res); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#008F11]" />
        <p className="text-gray-500">Loading learner...</p>
      </div>
    </AppShell>
  );

  if (!data) return <AppShell><p className="p-8 text-gray-500">Learner not found.</p></AppShell>;

  const { student, attempts } = data;
  const avgScore = attempts.length ? Math.round(attempts.reduce((a, b) => a + b.score, 0) / attempts.length) : 0;
  const passRate = attempts.length ? Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100) : 0;
  const allWeakTopics = [...new Set(attempts.flatMap((a) => a.weakTopics))];

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <Link href="/admin/learners" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Learners
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#008F11]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#008F11]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
              <p className="text-gray-500 text-sm">{student.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Skill Level", value: student.skillLevel || "—" },
            { label: "Career Readiness", value: `${student.careerReadinessScore || 0}%` },
            { label: "Avg Quiz Score", value: `${avgScore}%` },
            { label: "Pass Rate", value: `${passRate}%` },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs text-gray-500">{m.label}</p>
              <p className="text-xl font-bold text-gray-900 capitalize">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-[#008F11]" />
              <h3 className="font-semibold text-gray-800">Profile</h3>
            </div>
            <dl className="space-y-3 text-sm">
              {[
                { dt: "Primary Goal", dd: student.primaryGoal },
                { dt: "Learning Style", dd: student.learningStyle },
                { dt: "Preferred Course", dd: student.preferredCourse },
                { dt: "Joined", dd: student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "—" },
              ].map((item) => (
                <div key={item.dt} className="flex justify-between">
                  <dt className="text-gray-500">{item.dt}</dt>
                  <dd className="font-medium text-gray-800 capitalize">{item.dd || "—"}</dd>
                </div>
              ))}
            </dl>
            {allWeakTopics.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Weak Topics
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {allWeakTopics.map((t) => (
                    <span key={t} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#008F11]" />
              <h3 className="font-semibold text-gray-800">Quiz Attempts ({attempts.length})</h3>
            </div>
            {attempts.length === 0 ? (
              <p className="text-center py-8 text-gray-400 text-sm">No quiz attempts yet.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {attempts.map((a) => (
                  <div key={a.id} className="px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">{new Date(a.submittedAt).toLocaleDateString()}</p>
                      <p className="text-sm font-medium text-gray-800">Score: {a.score}%</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${a.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {a.passed ? "Passed" : "Failed"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
