"use client";

import { useEffect, useState } from "react";
import { Course } from "@/lib/models/course.model";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

const LEVEL_COLOR: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

const TRACK_GRADIENT: Record<string, string> = {
  Data: "from-blue-500 to-cyan-500",
  "AI/ML": "from-purple-500 to-pink-500",
  Business: "from-amber-500 to-orange-500",
  Cloud: "from-sky-500 to-blue-600",
};

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => { setCourses(d.courses || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const tracks = ["all", ...Array.from(new Set(courses.map((c) => c.track)))];
  const filtered = filter === "all" ? courses : courses.filter((c) => c.track === filter);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Course Catalog</h1>
          <p className="text-gray-500 text-sm mt-1">Choose your learning path and start building in-demand skills</p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {tracks.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${filter === t ? "bg-indigo-600 text-white" : "bg-white text-gray-600 border hover:border-indigo-300"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-xl h-52 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course) => (
              <Link key={course.id} href={`/student/courses/${course.id}`}>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group cursor-pointer">
                  <div className={`h-1.5 bg-gradient-to-r ${TRACK_GRADIENT[course.track] || "from-indigo-500 to-purple-500"}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{course.track}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${LEVEL_COLOR[course.level] || "bg-gray-100 text-gray-700"}`}>{course.level}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>⏱ {course.duration || "Self-paced"}</span>
                      <span className="text-indigo-500 font-medium group-hover:underline">Start Learning →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
