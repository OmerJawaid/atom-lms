"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";

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

export default function AdminAIInsightsPage() {
  const [data, setData] = useState<AIInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load(refresh = false) {
    if (refresh) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/ai-insights");
      const json = await res.json();
      if (json.success) setData(json);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  const severityBg = (severity: string) => {
    const map: Record<string, string> = {
      high: "bg-red-50 border-red-100",
      medium: "bg-yellow-50 border-yellow-100",
      low: "bg-green-50 border-green-100",
    };
    return map[severity] || "bg-gray-50 border-gray-100";
  };

  const severityBadge = (severity: string) => {
    const map: Record<string, string> = {
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-green-100 text-green-700",
    };
    return map[severity] || "bg-gray-100 text-gray-600";
  };

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#008F11]" />
        <p className="text-gray-500">Generating AI insights...</p>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-[#008F11]" />
              <h1 className="text-2xl font-bold text-gray-900">AI Insights Center</h1>
            </div>
            <p className="text-gray-500 text-sm">Gemini-powered platform intelligence • {data?.modelUsed || "gemini-2.5-flash"}</p>
          </div>
          <button onClick={() => load(true)} disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Regenerate
          </button>
        </div>

        {data && (
          <>
            <div className="bg-gradient-to-r from-[#0B1F33] to-[#1a3a5c] rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#4ade80]" />
                <span className="text-sm font-semibold text-[#4ade80]">Executive Summary</span>
              </div>
              <p className="text-gray-200 leading-relaxed">{data.summary}</p>
              <p className="text-xs text-gray-500 mt-3">Generated {new Date(data.generatedAt).toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.insights.map((insight, i) => (
                <div key={i} className={`rounded-xl border p-5 ${severityBg(insight.severity)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 flex-1">{insight.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ml-2 flex-shrink-0 ${severityBadge(insight.severity)}`}>{insight.severity}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{insight.evidence}</p>
                  <div className="space-y-2">
                    <div className="bg-white/70 rounded-lg px-3 py-2">
                      <p className="text-xs font-semibold text-gray-700">Recommended Action</p>
                      <p className="text-xs text-gray-600 mt-0.5">{insight.recommendedAction}</p>
                    </div>
                    <div className="bg-white/70 rounded-lg px-3 py-2">
                      <p className="text-xs font-semibold text-gray-700">Expected Impact</p>
                      <p className="text-xs text-gray-600 mt-0.5">{insight.expectedImpact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">How to use these insights</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">High</span> severity insights require immediate action — check the Learners tab for specific details.</li>
                <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold">Medium</span> severity insights should be addressed within 2 weeks — plan them into the next sprint.</li>
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold">Low</span> severity insights are improvement opportunities — track them in the content quality pipeline.</li>
                <li className="flex items-start gap-2"><span className="text-[#008F11] font-bold">→</span> Click Regenerate to get fresh AI analysis. Gemini analyzes live platform data on each run.</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
