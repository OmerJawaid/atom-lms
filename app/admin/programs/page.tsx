"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Loader2, BookMarked, ChevronRight, Search, TrendingUp } from "lucide-react";
import Link from "next/link";

interface ProgramWithPerf {
  id: string;
  title: string;
  slug: string;
  track: string;
  level: string;
  duration?: string;
  isPublished: boolean;
  performance?: {
    programName: string;
    enrolledLearners: number;
    avgCompletion: number;
    avgQuizScore: number;
    passRate: number;
    atRiskCount: number;
  } | null;
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<ProgramWithPerf[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/programs")
      .then((r) => r.json())
      .then((res) => { if (res.success) setPrograms(res.programs); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = programs.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.track.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#008F11]" />
        <p className="text-gray-500">Loading programs...</p>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookMarked className="w-5 h-5 text-[#008F11]" />
              <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
            </div>
            <p className="text-gray-500 text-sm">{programs.length} programs across all tracks</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Link key={p.id} href={`/admin/programs/${p.id}`} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-[#008F11] transition-colors">{p.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{p.track}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{p.level}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#008F11] transition-colors flex-shrink-0" />
              </div>
              {p.performance && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-xs text-gray-500">Enrolled</p>
                    <p className="text-sm font-semibold text-gray-800">{p.performance.enrolledLearners}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-xs text-gray-500">Completion</p>
                    <p className="text-sm font-semibold text-[#008F11]">{p.performance.avgCompletion}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-xs text-gray-500">Avg Quiz</p>
                    <p className="text-sm font-semibold text-gray-800">{p.performance.avgQuizScore}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-xs text-gray-500">At Risk</p>
                    <p className={`text-sm font-semibold ${p.performance.atRiskCount > 2 ? "text-red-600" : "text-gray-800"}`}>{p.performance.atRiskCount}</p>
                  </div>
                </div>
              )}
              {p.duration && <p className="text-xs text-gray-400 mt-3">{p.duration}</p>}
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <p>No programs match your search.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
