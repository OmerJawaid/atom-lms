"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/cards/StatusBadge";
import { AdminMetricGrid } from "@/components/admin/AdminMetricGrid";
import { CoursePerformanceChart } from "@/components/charts/CoursePerformanceChart";
import { AdminAnalytics } from "@/lib/models/analytics.model";
import { Loader2, BarChart3, TrendingUp, Award } from "lucide-react";
import { DEMO_ADMIN_ANALYTICS } from "@/lib/data/demoAnalytics";

export default function AdminDashboardPage() {
  const [data, setData] = useState<{ data: AdminAnalytics; usingDemoData: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin-analytics")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res);
        else setData({ data: DEMO_ADMIN_ANALYTICS, usingDemoData: true });
      })
      .catch(() => setData({ data: DEMO_ADMIN_ANALYTICS, usingDemoData: true }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#008F11]" />
        <p className="text-gray-500">Loading platform analytics...</p>
      </div>
    </AppShell>
  );

  if (!data) return null;

  const { data: analytics, usingDemoData } = data;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-[#008F11]" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Analytics</h1>
            </div>
            <p className="text-gray-500 text-sm">Platform-wide learning intelligence overview</p>
          </div>
          <div className="flex gap-2">
            {usingDemoData && <StatusBadge label="Demo Data Mode" status="neutral" />}
            <StatusBadge label="Live Dashboard" status="success" />
          </div>
        </div>

        {/* Metrics grid */}
        <AdminMetricGrid analytics={analytics} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CoursePerformanceChart data={analytics.coursePerformance} />

          {/* Summary card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#008F11]" />
              Platform Insights
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-[#008F11]/5 rounded-lg p-3">
                <Award className="w-5 h-5 text-[#008F11] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Top Performing Course</p>
                  <p className="text-sm text-gray-600">{analytics.mostRecommendedCourse} is the most recommended course across all learner profiles.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-yellow-50 rounded-lg p-3">
                <BarChart3 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Average Readiness</p>
                  <p className="text-sm text-gray-600">Platform career readiness is {analytics.averageCareerReadiness}%. {analytics.averageCareerReadiness < 65 ? "Consider introducing more structured support programs." : "Students are well-prepared for job roles."}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-3">
                <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Most Common Goal</p>
                  <p className="text-sm text-gray-600 capitalize">{analytics.mostCommonGoal} is the primary learning objective among enrolled students.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course performance table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Course Performance Details</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Learners</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Avg Score</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Progress Bar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {analytics.coursePerformance.map((c) => (
                <tr key={c.course} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.course}</td>
                  <td className="px-4 py-3 text-gray-600">{c.count}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{c.avgScore}%</td>
                  <td className="px-4 py-3">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#008F11] rounded-full"
                        style={{ width: `${c.avgScore}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
