"use client";

import { AdminAnalytics } from "@/lib/models/analytics.model";
import { MetricCard } from "@/components/cards/MetricCard";
import { Users, TrendingUp, Target, BookOpen, Brain, AlertTriangle, Award, Activity } from "lucide-react";

interface AdminMetricGridProps {
  analytics: AdminAnalytics;
}

type Tone = "default" | "success" | "warning" | "danger" | "primary";

export function AdminMetricGrid({ analytics }: AdminMetricGridProps) {
  const metrics: Array<{ title: string; value: string | number; subtitle: string; icon: React.ComponentType<{ className?: string }>; tone: Tone }> = [
    {
      title: "Total Learners",
      value: analytics.totalLearners,
      subtitle: "Active on platform",
      icon: Users,
      tone: "primary",
    },
    {
      title: "Avg Profile Confidence",
      value: `${analytics.averageConfidence}%`,
      subtitle: "Across all students",
      icon: TrendingUp,
      tone: analytics.averageConfidence >= 65 ? "success" : "warning",
    },
    {
      title: "Avg Career Readiness",
      value: `${analytics.averageCareerReadiness}%`,
      subtitle: "Platform average",
      icon: Target,
      tone: analytics.averageCareerReadiness >= 60 ? "success" : "warning",
    },
    {
      title: "Top Course",
      value: analytics.mostRecommendedCourse,
      subtitle: "Most recommended",
      icon: BookOpen,
      tone: "default",
    },
    {
      title: "Avg Quiz Accuracy",
      value: `${analytics.averageQuizAccuracy}%`,
      subtitle: "Adaptive quiz results",
      icon: Brain,
      tone: analytics.averageQuizAccuracy >= 65 ? "success" : "warning",
    },
    {
      title: "High Risk Learners",
      value: analytics.highRiskCount,
      subtitle: "Need intervention",
      icon: AlertTriangle,
      tone: analytics.highRiskCount > 0 ? "danger" : "success",
    },
    {
      title: "Most Common Goal",
      value: analytics.mostCommonGoal,
      subtitle: "Learning objective",
      icon: Award,
      tone: "default",
    },
    {
      title: "Platform Health",
      value: analytics.highRiskCount === 0 ? "Excellent" : analytics.highRiskCount <= 2 ? "Good" : "Needs Attention",
      subtitle: "Overall status",
      icon: Activity,
      tone: analytics.highRiskCount === 0 ? "success" : analytics.highRiskCount <= 2 ? "warning" : "danger",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <MetricCard key={m.title} title={m.title} value={m.value} subtitle={m.subtitle} icon={m.icon as Parameters<typeof MetricCard>[0]["icon"]} tone={m.tone} />
      ))}
    </div>
  );
}
