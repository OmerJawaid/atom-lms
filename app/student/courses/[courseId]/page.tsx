"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Course } from "@/lib/models/course.model";
import { Lecture } from "@/lib/models/lecture.model";
import { QuizMeta } from "@/lib/data/demoQuizzes";

interface PageProps { params: Promise<{ courseId: string }> }
const ICON: Record<string, string> = { video: "🎬", reading: "📖", lab: "🧪" };

export default function CourseDetailPage({ params }: PageProps) {
  const { courseId } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [quizzes, setQuizzes] = useState<QuizMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/courses/${courseId}`)
      .then((r) => r.json())
      .then((d) => { setCourse(d.course); setLectures(d.lectures || []); setQuizzes(d.quizzes || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [courseId]);

  if (loading) return <AppShell><div className="p-8 text-center text-gray-500 animate-pulse">Loading course...</div></AppShell>;
  if (!course) return <AppShell><div className="p-8 text-center text-red-500">Course not found.</div></AppShell>;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <Link href="/student/courses" className="text-sm text-indigo-600 hover:underline mb-4 inline-block">← Back to Catalog</Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-5">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{course.track}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">{course.level}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">⏱ {course.duration}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600 text-sm">{course.description}</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-indigo-50 rounded-lg p-3"><div className="text-xl font-bold text-indigo-600">{lectures.length}</div><div className="text-xs text-gray-500">Lectures</div></div>
            <div className="bg-green-50 rounded-lg p-3"><div className="text-xl font-bold text-green-600">{quizzes.length}</div><div className="text-xs text-gray-500">Quizzes</div></div>
            <div className="bg-purple-50 rounded-lg p-3"><div className="text-sm font-bold text-purple-600">{course.duration}</div><div className="text-xs text-gray-500">Duration</div></div>
          </div>
        </div>

        <h2 className="text-base font-bold text-gray-900 mb-3">Course Curriculum</h2>
        <div className="space-y-2">
          {lectures.map((lecture, idx) => {
            const quiz = quizzes.find((q) => q.lectureId === lecture.id);
            return (
              <div key={lecture.id} className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                <Link href={`/student/lectures/${lecture.id}`}>
                  <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-600 shrink-0">{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span>{ICON[lecture.lectureType] || "🎬"}</span>
                        <span className="font-medium text-gray-900 truncate">{lecture.title}</span>
                      </div>
                      {lecture.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{lecture.description}</p>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs text-gray-400">
                      <span>{lecture.durationMinutes}m</span>
                      <span className="text-indigo-500">Watch →</span>
                    </div>
                  </div>
                </Link>
                {quiz && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-t border-amber-100 text-xs">
                    <span>📝</span>
                    <span className="text-amber-800 font-medium">{quiz.title}</span>
                    <Link href={`/student/quiz/${quiz.id}`} className="ml-auto px-3 py-1 rounded-md bg-amber-500 text-white hover:bg-amber-600 font-medium">
                      Take Quiz
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
