"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Course } from "@/lib/models/course.model";

const LEVEL_COLOR: Record<string, string> = { beginner: "bg-green-100 text-green-700", intermediate: "bg-yellow-100 text-yellow-700", advanced: "bg-red-100 text-red-700" };

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses").then((r) => r.json()).then((d) => { setCourses(d.courses || []); setLoading(false); });
  }, []);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
            <p className="text-sm text-gray-500">{courses.length} courses in catalog</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Add Course</button>
        </div>
        {loading ? <div className="animate-pulse h-40 bg-gray-100 rounded-xl" /> : (
          <div className="space-y-3">
            {courses.map((c) => (
              <div key={c.id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{c.track}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${LEVEL_COLOR[c.level] || "bg-gray-100 text-gray-600"}`}>{c.level}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.isPublished ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{c.isPublished ? "Published" : "Draft"}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{c.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{c.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <Link href={`/student/courses/${c.id}`}><button className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Preview</button></Link>
                  <button className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
