"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface Analytics {
  coursePerformance: Array<{ courseName: string; attempts: number; avgAccuracy: number; passRate: number }>;
  weeklyAttempts: Array<{ week: string; attempts: number; avgScore: number }>;
  topWeakTopics: Array<{ topic: string; count: number }>;
  difficultyBreakdown: Array<{ difficulty: string; correct: number; wrong: number }>;
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

const FALLBACK: Analytics = {
  coursePerformance: [
    { courseName: "Data Analytics", attempts: 34, avgAccuracy: 72, passRate: 79 },
    { courseName: "AI/ML Foundations", attempts: 28, avgAccuracy: 65, passRate: 68 },
    { courseName: "Business Analytics", attempts: 21, avgAccuracy: 78, passRate: 86 },
    { courseName: "Cloud AWS", attempts: 19, avgAccuracy: 70, passRate: 74 },
    { courseName: "Agentic AI", attempts: 15, avgAccuracy: 61, passRate: 60 },
  ],
  weeklyAttempts: [
    { week: "Week 1", attempts: 12, avgScore: 62 },
    { week: "Week 2", attempts: 18, avgScore: 67 },
    { week: "Week 3", attempts: 24, avgScore: 71 },
    { week: "Week 4", attempts: 31, avgScore: 74 },
  ],
  topWeakTopics: [
    { topic: "Hypothesis Testing", count: 18 },
    { topic: "Backpropagation", count: 15 },
    { topic: "Window Functions", count: 12 },
    { topic: "DAX CALCULATE", count: 10 },
    { topic: "Multi-AZ RDS", count: 8 },
  ],
  difficultyBreakdown: [
    { difficulty: "Easy", correct: 78, wrong: 22 },
    { difficulty: "Medium", correct: 62, wrong: 38 },
    { difficulty: "Hard", correct: 44, wrong: 56 },
  ],
};

export default function InstructorAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instructor/analytics").then((r) => r.json()).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const d = data || FALLBACK;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500">Course performance and learner insights</p>
        </div>

        {loading ? <div className="animate-pulse h-96 bg-gray-100 rounded-xl" /> : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Course Performance (Accuracy vs Pass Rate)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={d.coursePerformance} margin={{ left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="courseName" tick={{ fontSize: 9 }} tickFormatter={(v) => v.split(" ")[0]} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="avgAccuracy" fill="#6366f1" name="Avg Accuracy %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="passRate" fill="#10b981" name="Pass Rate %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Weekly Activity</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={d.weeklyAttempts} margin={{ left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="attempts" stroke="#6366f1" strokeWidth={2} name="Attempts" dot={{ fill: "#6366f1" }} />
                    <Line type="monotone" dataKey="avgScore" stroke="#f59e0b" strokeWidth={2} name="Avg Score" dot={{ fill: "#f59e0b" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Top Weak Topics</h3>
                <div className="space-y-3">
                  {d.topWeakTopics.map((t, i) => (
                    <div key={t.topic} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div className="h-full rounded-full flex items-center pl-3" style={{ width: `${(t.count / d.topWeakTopics[0].count) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }}>
                          <span className="text-white text-xs font-medium truncate">{t.topic}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{t.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Accuracy by Difficulty</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={d.difficultyBreakdown} margin={{ left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="difficulty" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="correct" fill="#10b981" name="Correct %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="wrong" fill="#ef4444" name="Wrong %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
