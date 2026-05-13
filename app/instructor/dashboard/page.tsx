"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/cards/MetricCard";
import { StatusBadge } from "@/components/cards/StatusBadge";
import { AtRiskStudentsTable } from "@/components/instructor/AtRiskStudentsTable";
import { InterventionPanel } from "@/components/instructor/InterventionPanel";
import { WeakTopicChart } from "@/components/charts/WeakTopicChart";
import { InstructorInsights } from "@/lib/models/analytics.model";
import { Users, AlertTriangle, BookOpen, TrendingDown, Loader2, BookMarked, ClipboardCheck, Target } from "lucide-react";
import Link from "next/link";

export default function InstructorDashboardPage() {
  const [data, setData] = useState<{ data: InstructorInsights; usingDemoData: boolean } | null>(null);
  const [lmsStats, setLmsStats] = useState<{ totalCourses: number; totalLectures: number; totalQuizzes: number; avgAccuracy: number; passRate: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/instructor-insights").then((r) => r.json()),
      fetch("/api/instructor/dashboard").then((r) => r.json()),
    ]).then(([insights, lms]) => {
      if (insights.success) setData(insights);
      if (lms.success) setLmsStats(lms.stats);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#008F11]" />
        <p className="text-gray-500">Loading instructor workspace...</p>
      </div>
    </AppShell>
  );

  const insights = data?.data;
  const highRisk = insights?.atRiskStudents.filter((s) => s.riskLevel === "High").length ?? 0;
  const medRisk = insights?.atRiskStudents.filter((s) => s.riskLevel === "Medium").length ?? 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Monitor learner progress and manage course content</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {data?.usingDemoData && <StatusBadge label="Demo Data Mode" status="neutral" />}
            <StatusBadge label="AI Risk Analysis" status="ai" />
          </div>
        </div>

        {/* LMS Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{lmsStats?.totalCourses ?? 5}</div>
            <div className="text-xs text-gray-500 mt-1">Courses</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{lmsStats?.totalLectures ?? 27}</div>
            <div className="text-xs text-gray-500 mt-1">Lectures</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{lmsStats?.totalQuizzes ?? 15}</div>
            <div className="text-xs text-gray-500 mt-1">Quizzes</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{lmsStats?.avgAccuracy ?? 68}%</div>
            <div className="text-xs text-gray-500 mt-1">Avg Accuracy</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{lmsStats?.passRate ?? 72}%</div>
            <div className="text-xs text-gray-500 mt-1">Pass Rate</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Manage Courses", href: "/instructor/courses", icon: "📚", color: "bg-indigo-50 hover:bg-indigo-100" },
            { label: "View Submissions", href: "/instructor/submissions", icon: "📝", color: "bg-green-50 hover:bg-green-100" },
            { label: "Question Bank", href: "/instructor/questions", icon: "❓", color: "bg-purple-50 hover:bg-purple-100" },
            { label: "Interventions", href: "/instructor/interventions", icon: "⚠️", color: "bg-red-50 hover:bg-red-100" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`${item.color} rounded-xl p-4 cursor-pointer transition-colors`}>
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-sm font-semibold text-gray-800">{item.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {insights && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard title="Total Students" value={insights.atRiskStudents.length} icon={Users} tone="primary" />
              <MetricCard title="High Risk" value={highRisk} subtitle="Need urgent help" icon={AlertTriangle} tone={highRisk > 0 ? "danger" : "success"} />
              <MetricCard title="Medium Risk" value={medRisk} subtitle="Monitor closely" icon={TrendingDown} tone={medRisk > 0 ? "warning" : "success"} />
              <MetricCard title="Weak Topics" value={insights.weakTopicHeatmap.length} subtitle="Identified areas" icon={BookOpen} tone="default" />
            </div>

            <AtRiskStudentsTable students={insights.atRiskStudents} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <WeakTopicChart data={insights.weakTopicHeatmap} />
              <InterventionPanel interventions={insights.interventionSuggestions} />
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
