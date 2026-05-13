"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Loader2, Star, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { ContentQualityReview } from "@/lib/models/content-quality.model";
import { getQualityLevel } from "@/lib/services/content-quality.service";

export default function AdminContentQualityPage() {
  const [issues, setIssues] = useState<ContentQualityReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "reviewing" | "fixed">("all");

  useEffect(() => {
    fetch("/api/admin/content-quality")
      .then((r) => r.json())
      .then((res) => { if (res.success) setIssues(res.issues); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: ContentQualityReview["status"]) {
    setUpdating(id);
    try {
      await fetch(`/api/admin/content-quality/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setIssues((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    } finally {
      setUpdating(null);
    }
  }

  const filtered = filter === "all" ? issues : issues.filter((i) => i.status === filter);
  const counts = { open: issues.filter((i) => i.status === "open").length, reviewing: issues.filter((i) => i.status === "reviewing").length, fixed: issues.filter((i) => i.status === "fixed").length };

  const issueTypeLabel = (t: ContentQualityReview["issueType"]) => ({
    high_failure_rate: "High Failure Rate",
    low_completion: "Low Completion",
    no_quiz_attached: "No Quiz Attached",
    outdated_content: "Outdated Content",
    unclear_quiz_questions: "Unclear Quiz Questions",
    low_engagement: "Low Engagement",
  }[t] || t);

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#008F11]" />
        <p className="text-gray-500">Loading quality issues...</p>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 text-[#008F11]" />
            <h1 className="text-2xl font-bold text-gray-900">Content Quality Review</h1>
          </div>
          <p className="text-gray-500 text-sm">AI-detected quality issues across all programs</p>
        </div>

        {/* Status filter */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "all", label: `All (${issues.length})` },
            { value: "open", label: `Open (${counts.open})`, color: "text-red-600" },
            { value: "reviewing", label: `Reviewing (${counts.reviewing})`, color: "text-yellow-600" },
            { value: "fixed", label: `Fixed (${counts.fixed})`, color: "text-green-600" },
          ].map((f) => (
            <button key={f.value} onClick={() => setFilter(f.value as typeof filter)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${filter === f.value ? "bg-[#008F11] text-white border-[#008F11]" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((issue) => {
            const quality = getQualityLevel(issue.qualityScore);
            return (
              <div key={issue.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-800">{issue.courseName}</h3>
                      {issue.lectureName && <span className="text-xs text-gray-400">→ {issue.lectureName}</span>}
                      {issue.quizName && <span className="text-xs text-gray-400">→ {issue.quizName}</span>}
                    </div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs font-semibold ${quality.color}`}>Score: {issue.qualityScore}/100 ({quality.label})</span>
                      <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">{issueTypeLabel(issue.issueType)}</span>
                    </div>
                    <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                      <div className={`h-full rounded-full ${issue.qualityScore >= 80 ? "bg-green-500" : issue.qualityScore >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${issue.qualityScore}%` }} />
                    </div>
                    <p className="text-sm text-gray-600 italic">{issue.recommendation}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full text-center ${
                      issue.status === "fixed" ? "bg-green-100 text-green-700" :
                      issue.status === "reviewing" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                    }`}>
                      {issue.status === "fixed" ? <CheckCircle className="w-3 h-3 inline mr-1" /> :
                       issue.status === "reviewing" ? <Clock className="w-3 h-3 inline mr-1" /> :
                       <AlertTriangle className="w-3 h-3 inline mr-1" />}
                      {issue.status}
                    </span>
                    <div className="flex flex-col gap-1">
                      {issue.status !== "reviewing" && (
                        <button onClick={() => updateStatus(issue.id, "reviewing")} disabled={updating === issue.id}
                          className="text-xs px-2 py-1 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 disabled:opacity-50">
                          Mark Reviewing
                        </button>
                      )}
                      {issue.status !== "fixed" && (
                        <button onClick={() => updateStatus(issue.id, "fixed")} disabled={updating === issue.id}
                          className="text-xs px-2 py-1 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 disabled:opacity-50">
                          Mark Fixed
                        </button>
                      )}
                      {issue.status !== "open" && (
                        <button onClick={() => updateStatus(issue.id, "open")} disabled={updating === issue.id}
                          className="text-xs px-2 py-1 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p>No issues in this category.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
