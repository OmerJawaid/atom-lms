"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";

interface Student {
  id: string;
  name: string;
  email?: string;
  skill_level?: string;
  primary_goal?: string;
  confidence_score?: number;
  career_readiness_score?: number;
}

const LEVEL_COLOR: Record<string, string> = { beginner: "bg-green-100 text-green-700", intermediate: "bg-yellow-100 text-yellow-700", advanced: "bg-red-100 text-red-700" };

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/instructor/students").then((r) => r.json()).then((d) => { setStudents(d.students || []); setLoading(false); });
  }, []);

  const filtered = students.filter((s) => !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            <p className="text-sm text-gray-500">{students.length} enrolled</p>
          </div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..." className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        {loading ? <div className="animate-pulse h-40 bg-gray-100 rounded-xl" /> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Level</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Goal</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Confidence</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Career Ready</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><div className="font-medium text-gray-900">{s.name}</div><div className="text-xs text-gray-400">{s.email || "—"}</div></td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full capitalize ${LEVEL_COLOR[s.skill_level || ""] || "bg-gray-100 text-gray-600"}`}>{s.skill_level || "—"}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate">{s.primary_goal || "—"}</td>
                    <td className="px-4 py-3 text-center font-semibold text-indigo-600 text-sm">{s.confidence_score ?? "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-semibold ${(s.career_readiness_score || 0) >= 70 ? "text-green-600" : (s.career_readiness_score || 0) >= 50 ? "text-yellow-600" : "text-red-500"}`}>
                        {s.career_readiness_score ?? "—"}%
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No students found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
