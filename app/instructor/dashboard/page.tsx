"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/cards/MetricCard";
import { StatusBadge } from "@/components/cards/StatusBadge";
import { AtRiskStudentsTable } from "@/components/instructor/AtRiskStudentsTable";
import { InterventionPanel } from "@/components/instructor/InterventionPanel";
import { WeakTopicChart } from "@/components/charts/WeakTopicChart";
import { InstructorInsights } from "@/lib/models/analytics.model";
import { Users, AlertTriangle, BookOpen, TrendingDown, Loader2 } from "lucide-react";

export default function InstructorDashboardPage() {
  const [data, setData] = useState<{ data: InstructorInsights; usingDemoData: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instructor-insights")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res);
      })
      .catch(() => { /* handled */ })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#008F11]" />
        <p className="text-gray-500">Loading instructor insights...</p>
      </div>
    </AppShell>
  );

  if (!data) return (
    <AppShell>
      <div className="text-center text-gray-500 py-16">Failed to load data. Please refresh.</div>
    </AppShell>
  );

  const { data: insights, usingDemoData } = data;
  const highRisk = insights.atRiskStudents.filter((s) => s.riskLevel === "High").length;
  const medRisk = insights.atRiskStudents.filter((s) => s.riskLevel === "Medium").length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Monitor learner progress and at-risk students</p>
          </div>
          <div className="flex gap-2">
            {usingDemoData && <StatusBadge label="Demo Data Mode" status="neutral" />}
            <StatusBadge label="AI Risk Analysis" status="ai" />
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Total Students" value={insights.atRiskStudents.length} icon={Users} tone="primary" />
          <MetricCard title="High Risk" value={highRisk} subtitle="Need urgent help" icon={AlertTriangle} tone={highRisk > 0 ? "danger" : "success"} />
          <MetricCard title="Medium Risk" value={medRisk} subtitle="Monitor closely" icon={TrendingDown} tone={medRisk > 0 ? "warning" : "success"} />
          <MetricCard title="Weak Topics" value={insights.weakTopicHeatmap.length} subtitle="Identified areas" icon={BookOpen} tone="default" />
        </div>

        {/* Students table */}
        <AtRiskStudentsTable students={insights.atRiskStudents} />

        {/* Charts + Interventions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WeakTopicChart data={insights.weakTopicHeatmap} />
          <InterventionPanel interventions={insights.interventionSuggestions} />
        </div>
      </div>
    </AppShell>
  );
}
