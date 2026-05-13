"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Lecture } from "@/lib/models/lecture.model";
import { QuizMeta } from "@/lib/data/demoQuizzes";

interface PageProps { params: Promise<{ lectureId: string }> }

export default function LectureViewerPage({ params }: PageProps) {
  const { lectureId } = use(params);
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [quiz, setQuiz] = useState<QuizMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetch(`/api/lectures/${lectureId}`)
      .then((r) => r.json())
      .then((d) => { setLecture(d.lecture); setQuiz(d.quiz || null); setLoading(false); })
      .catch(() => setLoading(false));

    const done = typeof window !== "undefined" ? localStorage.getItem(`lecture_done_${lectureId}`) : null;
    if (done) setCompleted(true);
  }, [lectureId]);

  async function handleComplete() {
    setCompleting(true);
    const studentId = localStorage.getItem("studentId") || "demo-student";
    try {
      await fetch(`/api/lectures/${lectureId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
    } catch { /* graceful fallback */ }
    setCompleted(true);
    localStorage.setItem(`lecture_done_${lectureId}`, "1");
    setCompleting(false);
  }

  if (loading) return <AppShell><div className="text-center text-gray-500 py-16 animate-pulse">Loading lecture...</div></AppShell>;
  if (!lecture) return <AppShell><div className="text-center text-red-500 py-16">Lecture not found.</div></AppShell>;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <Link href={`/student/courses/${lecture.courseId}`} className="text-sm text-indigo-600 hover:underline mb-4 inline-block">← Back to Course</Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400 uppercase tracking-wide">{lecture.lectureType}</span>
            <span className="text-xs text-gray-400">• {lecture.durationMinutes} min</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{lecture.title}</h1>
          {lecture.description && <p className="text-gray-500 text-sm mb-5">{lecture.description}</p>}

          {lecture.videoUrl && (
            <div className="mb-6 rounded-lg overflow-hidden bg-gray-900 aspect-video flex items-center justify-center text-gray-400 text-sm">
              ▶ Video player: {lecture.videoUrl}
            </div>
          )}

          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {lecture.content}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          {completed ? (
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-green-700 font-semibold mb-1">Lecture Complete!</p>
              {quiz ? (
                <div>
                  <p className="text-sm text-gray-500 mb-4">The quiz for this lecture is now unlocked.</p>
                  <Link href={`/student/quiz/${quiz.id}`}>
                    <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                      Take Quiz: {quiz.title}
                    </button>
                  </Link>
                </div>
              ) : (
                <Link href={`/student/courses/${lecture.courseId}`}>
                  <button className="px-6 py-2.5 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200">Continue Course →</button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Mark as Complete</p>
                <p className="text-sm text-gray-500">{quiz ? "Completing unlocks the quiz." : "Track your progress."}</p>
              </div>
              <button onClick={handleComplete} disabled={completing} className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
                {completing ? "Saving..." : "Mark Complete"}
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
