"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Loader2, FileText, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { AdminReport, ReportType } from "@/lib/models/report.model";

const REPORT_TYPES: { value: ReportType; label: string; description: string }[] = [
  { value: "course_performance", label: "Course Performance", description: "Completion rates, quiz scores, and learner outcomes per program" },
  { value: "learner_progress", label: "Learner Progress", description: "Individual progress, risk levels, and career readiness" },
  { value: "cohort_summary", label: "Cohort Summary", description: "Cohort-level performance and completion trends" },
  { value: "instructor_performance", label: "Instructor Performance", description: "Ratings, completion rates, and learner outcomes per instructor" },
  { value: "quiz_performance", label: "Quiz Performance", description: "Pass rates, difficulty analysis, and weak topic identification" },
  { value: "ai_recommendation_summary", label: "AI Recommendations", description: "Learner profiling accuracy, recommendation trends" },
  { value: "content_quality", label: "Content Quality", description: "Quality scores, issues, and improvement recommendations" },
];

export default function AdminReportsPage() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<ReportType | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("last_30_days");

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then((res) => { if (res.success) setReports(res.reports); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function generate(reportType: ReportType) {
    setGenerating(reportType);
    try {
      const res = await fetch("/api/admin/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType, dateRange }),
      });
      const data = await res.json();
      if (data.success) setReports((prev) => [data.report, ...prev]);
    } finally {
      setGenerating(null);
    }
  }

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#008F11]" />
        <p className="text-gray-500">Loading reports...</p>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-[#008F11]" />
            <h1 className="text-2xl font-bold text-gray-900">Reports Center</h1>
          </div>
          <p className="text-gray-500 text-sm">Generate AI-enhanced platform reports with Gemini analysis</p>
        </div>

        {/* Generate section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Generate New Report</h3>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30">
              <option value="last_7_days">Last 7 days</option>
              <option value="last_30_days">Last 30 days</option>
              <option value="last_90_days">Last 90 days</option>
              <option value="current">Current</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {REPORT_TYPES.map((rt) => (
              <button key={rt.value} onClick={() => generate(rt.value)} disabled={generating === rt.value}
                className="text-left p-4 border border-gray-200 rounded-xl hover:border-[#008F11]/50 hover:bg-[#008F11]/5 transition-all group disabled:opacity-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-[#008F11]">{rt.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{rt.description}</p>
                  </div>
                  {generating === rt.value ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#008F11] flex-shrink-0 ml-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-gray-300 group-hover:text-[#008F11] flex-shrink-0 ml-2" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Report list */}
        {reports.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Generated Reports</h3>
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(expanded === report.id ? null : report.id)}>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800">{report.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${report.generatedBy === "gemini" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"}`}>
                        {report.generatedBy === "gemini" ? "AI Enhanced" : "Template"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(report.generatedAt).toLocaleString()} • {report.dateRange}</p>
                  </div>
                  {expanded === report.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {expanded === report.id && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                    <p className="text-sm text-gray-700 italic">{report.summary}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {report.keyMetrics.map((m) => (
                        <div key={m.label} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">{m.label}</p>
                          <p className="font-bold text-gray-800">{m.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">Key Findings</h4>
                        <ul className="space-y-1.5">
                          {report.findings.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-[#008F11] font-bold flex-shrink-0">•</span>{f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">Recommended Actions</h4>
                        <ul className="space-y-1.5">
                          {report.recommendedActions.map((a, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-blue-600 font-bold flex-shrink-0">{i + 1}.</span>{a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
