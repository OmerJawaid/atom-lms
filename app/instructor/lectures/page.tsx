"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Lecture } from "@/lib/models/lecture.model";
import { DEMO_COURSES } from "@/lib/models/course.model";

const TYPE_ICON: Record<string, string> = { video: "🎬", reading: "📖", lab: "🧪" };

export default function InstructorLecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState("all");

  useEffect(() => {
    const all: Lecture[] = [];
    Promise.all(
      DEMO_COURSES.map((c) => fetch(`/api/courses/${c.id}`).then((r) => r.json()).then((d) => all.push(...(d.lectures || []))).catch(() => {}))
    ).then(() => { setLectures(all); setLoading(false); });
  }, []);

  const filtered = filterCourse === "all" ? lectures : lectures.filter((l) => l.courseId === filterCourse);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lectures</h1>
            <p className="text-sm text-gray-500">{filtered.length} lectures</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Add Lecture</button>
        </div>

        <div className="mb-4">
          <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="all">All Courses</option>
            {DEMO_COURSES.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        {loading ? <div className="animate-pulse h-40 bg-gray-100 rounded-xl" /> : (
          <div className="space-y-2">
            {filtered.map((l) => {
              const course = DEMO_COURSES.find((c) => c.id === l.courseId);
              return (
                <div key={l.id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-500 shrink-0">{l.orderIndex}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span>{TYPE_ICON[l.lectureType] || "🎬"}</span>
                      <span className="font-medium text-gray-900 truncate">{l.title}</span>
                    </div>
                    <p className="text-xs text-gray-400">{course?.title || l.courseId} • {l.durationMinutes}m</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/student/lectures/${l.id}`}><button className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Preview</button></Link>
                    <button className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">Edit</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
