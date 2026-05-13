"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Loader2, LayoutDashboard, Users, BookOpen, TrendingUp, AlertTriangle, Calendar, Sparkles, Activity } from "lucide-react";
import { AdminMetrics, ProgramPerformance, CohortPerformance, RiskDistribution, PlatformEvent } from "@/lib/models/admin.model";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Link from "next/link";

interface AIInsight {
  title: string;
  severity: "high" | "medium" | "low";
  evidence: string;
  recommendedAction: string;
  expectedImpact: string;
}

interface AIInsightsData {
  summary: string;
  insights: AIInsight[];
  generatedAt: string;
  modelUsed: "gemini" | "fallback";
}

interface DashboardData {
  metrics: AdminMetrics;
  programPerformance: ProgramPerformance[];
  cohortPerformance: CohortPerformance[];
  riskDistribution: RiskDistribution[];
  recentEvents: PlatformEvent[];
  aiInsights: AIInsightsData;
}

const RISK_COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((res) => { if (res.success) setData(res); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#008F11]" />
        <p className="text-gray-500">Loading admin dashboard...</p>
      </div>
    </AppShell>
  );

  if (!data) return <AppShell><p className="p-8 text-gray-500">Failed to load dashboard.</p></AppShell>;

  const { metrics, programPerformance, cohortPerformance, riskDistribution, recentEvents, aiInsights } = data;

  const metricCards = [
    { label: "Total Learners", value: metrics.totalLearners, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Cohorts", value: metrics.activeCohorts, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Avg Completion", value: `${metrics.averageCompletion}%`, icon: TrendingUp, color: "text-[#008F11]", bg: "bg-green-50" },
    { label: "At-Risk Learners", value: metrics.highRiskLearners, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Programs", value: metrics.totalPrograms, icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Avg Quiz Score", value: `${metrics.averageQuizScore}%`, icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const barData = programPerformance.map((p) => ({
    name: p.title.split(" ")[0],
    completion: p.averageCompletion,
    quiz: p.averageQuizScore,
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="w-5 h-5 text-[#008F11]" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Command Center</h1>
            </div>
            <p className="text-gray-500 text-sm">Platform-wide intelligence overview for atomcamp LMS</p>
          </div>
          <Link href="/admin/ai-insights" className="flex items-center gap-2 px-4 py-2 bg-[#008F11] text-white rounded-lg text-sm hover:bg-[#007a0f] transition-colors">
            <Sparkles className="w-4 h-4" />
            AI Insights
          </Link>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metricCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Program Performance</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="completion" fill="#008F11" radius={[4, 4, 0, 0]} name="Completion" />
                <Bar dataKey="quiz" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Quiz Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={riskDistribution} dataKey="count" nameKey="level" cx="50%" cy="50%" outerRadius={70}>
                  {riskDistribution.map((_, i) => <Cell key={i} fill={RISK_COLORS[i % RISK_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {riskDistribution.map((r, i) => (
                <div key={r.level} className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: RISK_COLORS[i] }} />
                  <span className="text-xs text-gray-600 capitalize">{r.level} ({r.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cohort performance + AI insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Cohort Performance</h3>
              <Link href="/admin/cohorts" className="text-xs text-[#008F11] hover:underline">View All</Link>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Cohort</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Completion</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">At Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cohortPerformance.map((c) => (
                  <tr key={c.cohortId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800 text-xs truncate max-w-[120px]">{c.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#008F11] rounded-full" style={{ width: `${c.averageCompletion}%` }} />
                        </div>
                        <span className="text-xs text-gray-600">{c.averageCompletion}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.riskCount > 3 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {c.riskCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#008F11]" />
              <h3 className="font-semibold text-gray-800">AI Insights</h3>
              <span className="text-xs text-gray-400">({aiInsights.modelUsed})</span>
            </div>
            <p className="text-sm text-gray-600 mb-4 italic text-xs">{aiInsights.summary}</p>
            <div className="space-y-2">
              {aiInsights.insights.slice(0, 3).map((insight, i) => (
                <div key={i} className={`rounded-lg p-3 ${insight.severity === "high" ? "bg-red-50" : insight.severity === "medium" ? "bg-yellow-50" : "bg-green-50"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-gray-800">{insight.title}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${insight.severity === "high" ? "bg-red-100 text-red-700" : insight.severity === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{insight.severity}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{insight.recommendedAction}</p>
                </div>
              ))}
            </div>
            <Link href="/admin/ai-insights" className="text-xs text-[#008F11] hover:underline mt-3 block">View all insights →</Link>
          </div>
        </div>

        {/* Recent events */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Recent Platform Events</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentEvents.map((event) => (
              <div key={event.id} className="px-4 py-3 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{event.description}</p>
                  <p className="text-xs text-gray-400">{event.actorRole && `${event.actorRole} • `}{new Date(event.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-xs text-gray-400 capitalize">{event.eventType.replace(/_/g, " ")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Manage Programs", href: "/admin/programs", color: "bg-indigo-600" },
            { label: "Manage Learners", href: "/admin/learners", color: "bg-blue-600" },
            { label: "Manage Cohorts", href: "/admin/cohorts", color: "bg-purple-600" },
            { label: "Generate Reports", href: "/admin/reports", color: "bg-[#008F11]" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className={`${link.color} text-white rounded-xl p-4 text-sm font-medium hover:opacity-90 transition-opacity text-center`}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
