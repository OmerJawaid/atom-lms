"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Loader2, Users, Search, ChevronRight, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface LearnerRow {
  id: string;
  name: string;
  email: string;
  skillLevel?: string;
  primaryGoal?: string;
  careerReadinessScore?: number;
  avgQuizScore: number;
  quizAttempts: number;
  riskLevel: "high" | "medium" | "low";
  createdAt?: string;
}

export default function AdminLearnersPage() {
  const [learners, setLearners] = useState<LearnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "medium" | "low">("all");

  useEffect(() => {
    fetch("/api/admin/learners")
      .then((r) => r.json())
      .then((res) => { if (res.success) setLearners(res.learners); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = learners.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === "all" || l.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  const riskCounts = {
    high: learners.filter((l) => l.riskLevel === "high").length,
    medium: learners.filter((l) => l.riskLevel === "medium").length,
    low: learners.filter((l) => l.riskLevel === "low").length,
  };

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#008F11]" />
        <p className="text-gray-500">Loading learners...</p>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-[#008F11]" />
            <h1 className="text-2xl font-bold text-gray-900">Learners</h1>
          </div>
          <p className="text-gray-500 text-sm">{learners.length} learners on platform</p>
        </div>

        {/* Risk summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { level: "high", count: riskCounts.high, label: "High Risk", color: "bg-red-50 text-red-700 border-red-200" },
            { level: "medium", count: riskCounts.medium, label: "Medium Risk", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
            { level: "low", count: riskCounts.low, label: "Low Risk", color: "bg-green-50 text-green-700 border-green-200" },
          ].map((r) => (
            <button key={r.level} onClick={() => setRiskFilter(riskFilter === r.level as "all" | "high" | "medium" | "low" ? "all" : r.level as "all" | "high" | "medium" | "low")}
              className={`rounded-xl border p-4 text-left transition-all hover:shadow-sm ${r.color} ${riskFilter === r.level ? "ring-2 ring-offset-1 ring-current" : ""}`}>
              <p className="text-2xl font-bold">{r.count}</p>
              <p className="text-xs font-medium">{r.label}</p>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search learners..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Learner</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Skill Level</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Readiness</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Avg Quiz</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Risk</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{l.name}</p>
                    <p className="text-xs text-gray-400">{l.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full capitalize">{l.skillLevel || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${(l.careerReadinessScore || 0) >= 65 ? "bg-[#008F11]" : (l.careerReadinessScore || 0) >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${l.careerReadinessScore || 0}%` }} />
                      </div>
                      <span className="text-xs text-gray-600">{l.careerReadinessScore || 0}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{l.avgQuizScore}%</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                      l.riskLevel === "high" ? "bg-red-100 text-red-700" :
                      l.riskLevel === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                    }`}>
                      {l.riskLevel === "high" && <AlertTriangle className="w-3 h-3" />}
                      {l.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/learners/${l.id}`} className="text-[#008F11] hover:underline">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No learners found.</p>}
        </div>
      </div>
    </AppShell>
  );
}
