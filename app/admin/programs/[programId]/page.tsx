"use client";

import { use, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Loader2, BookMarked, PlayCircle, ClipboardList, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProgramDetail {
  program: { id: string; title: string; track: string; level: string; duration?: string; description?: string };
  lectures: { id: string; title: string; orderIndex: number; durationMinutes: number; lectureType: string; isPublished: boolean }[];
  quizzes: { id: string; title: string; difficulty: string; passingScore: number; isPublished: boolean }[];
}

export default function AdminProgramDetailPage({ params }: { params: Promise<{ programId: string }> }) {
  const { programId } = use(params);
  const [data, setData] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/programs/${programId}`)
      .then((r) => r.json())
      .then((res) => { if (res.success) setData(res); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [programId]);

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#008F11]" />
        <p className="text-gray-500">Loading program...</p>
      </div>
    </AppShell>
  );

  if (!data) return <AppShell><p className="p-8 text-gray-500">Program not found.</p></AppShell>;

  const { program, lectures, quizzes } = data;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <Link href="/admin/programs" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Programs
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <BookMarked className="w-5 h-5 text-[#008F11]" />
            <h1 className="text-2xl font-bold text-gray-900">{program.title}</h1>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{program.track}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{program.level}</span>
            {program.duration && <span className="text-xs text-gray-400">{program.duration}</span>}
          </div>
          {program.description && <p className="text-sm text-gray-600 mt-3 max-w-2xl">{program.description}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-[#008F11]" />
              <h3 className="font-semibold text-gray-800">Lectures ({lectures.length})</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {lectures.map((l) => (
                <div key={l.id} className="px-4 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs flex items-center justify-center font-semibold flex-shrink-0">{l.orderIndex}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{l.title}</p>
                    <p className="text-xs text-gray-400">{l.durationMinutes} min • {l.lectureType}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${l.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {l.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#008F11]" />
              <h3 className="font-semibold text-gray-800">Quizzes ({quizzes.length})</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {quizzes.map((q) => (
                <div key={q.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{q.title}</p>
                    <p className="text-xs text-gray-400">Passing: {q.passingScore}% • {q.difficulty}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${q.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {q.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
