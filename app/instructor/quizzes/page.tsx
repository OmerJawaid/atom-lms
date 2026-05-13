"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { DEMO_QUIZZES, QuizMeta } from "@/lib/data/demoQuizzes";
import { DEMO_COURSES } from "@/lib/models/course.model";

const DIFF_COLOR: Record<string, string> = { easy: "bg-green-100 text-green-700", medium: "bg-yellow-100 text-yellow-700", hard: "bg-red-100 text-red-700" };

export default function InstructorQuizzesPage() {
  const [quizzes] = useState<QuizMeta[]>(DEMO_QUIZZES);
  const [filterCourse, setFilterCourse] = useState("all");
  const [generating, setGenerating] = useState<string | null>(null);
  const [genResult, setGenResult] = useState<Record<string, number>>({});

  const filtered = filterCourse === "all" ? quizzes : quizzes.filter((q) => q.courseId === filterCourse);

  async function handleGenerate(quizId: string) {
    setGenerating(quizId);
    try {
      const res = await fetch(`/api/quizzes/${quizId}/generate-questions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ count: 5 }) });
      const data = await res.json();
      setGenResult((p) => ({ ...p, [quizId]: data.count || 0 }));
    } catch { setGenResult((p) => ({ ...p, [quizId]: -1 })); }
    finally { setGenerating(null); }
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
            <p className="text-sm text-gray-500">{filtered.length} quizzes</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Add Quiz</button>
        </div>

        <div className="mb-4">
          <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="all">All Courses</option>
            {DEMO_COURSES.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          {filtered.map((q) => {
            const course = DEMO_COURSES.find((c) => c.id === q.courseId);
            return (
              <div key={q.id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${DIFF_COLOR[q.difficulty]}`}>{q.difficulty}</span>
                    <span className="text-xs text-gray-400">{q.timeLimitMinutes}m</span>
                    {q.isAdaptive && <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">Adaptive</span>}
                  </div>
                  <h3 className="font-medium text-gray-900">{q.title}</h3>
                  <p className="text-xs text-gray-400">{course?.title || q.courseId} • Pass: {q.passingScore}%</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {genResult[q.id] !== undefined && (
                    <span className={`text-xs ${genResult[q.id] > 0 ? "text-green-600" : "text-red-500"}`}>
                      {genResult[q.id] > 0 ? `✓ ${genResult[q.id]} generated` : "Failed"}
                    </span>
                  )}
                  <button onClick={() => handleGenerate(q.id)} disabled={generating === q.id} className="px-3 py-1.5 text-xs bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 disabled:opacity-50">
                    {generating === q.id ? "Generating..." : "🤖 AI Generate"}
                  </button>
                  <Link href={`/student/quiz/${q.id}`}><button className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">Preview</button></Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
