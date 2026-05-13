"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Loader2, Settings, Save, CheckCircle } from "lucide-react";
import { AdminSettings } from "@/lib/models/admin.model";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((res) => { if (res.success) setSettings(res.settings); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  function updateField<K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) {
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#008F11]" />
        <p className="text-gray-500">Loading settings...</p>
      </div>
    </AppShell>
  );

  if (!settings) return <AppShell><p className="p-8 text-gray-500">Failed to load settings.</p></AppShell>;

  return (
    <AppShell>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-5 h-5 text-[#008F11]" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
            </div>
            <p className="text-gray-500 text-sm">Configure platform-wide behaviour and AI thresholds</p>
          </div>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#008F11] text-white rounded-lg text-sm hover:bg-[#007a0f] disabled:opacity-50">
            {saved ? <CheckCircle className="w-4 h-4" /> : saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : saving ? "Saving..." : "Save Settings"}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
          <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Platform Name</label>
              <input value={settings.platformName} onChange={(e) => updateField("platformName", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Default Quiz Passing Score (%)</label>
              <input type="number" min={0} max={100} value={settings.defaultQuizPassingScore}
                onChange={(e) => updateField("defaultQuizPassingScore", parseInt(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Minimum Completion Threshold (%)</label>
              <input type="number" min={0} max={100} value={settings.minimumCompletionThreshold}
                onChange={(e) => updateField("minimumCompletionThreshold", parseInt(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
          <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Risk Score Thresholds</h3>
          <p className="text-sm text-gray-500">Learners with career readiness scores below these thresholds are flagged at risk.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">High Risk Threshold (score below this = high risk)</label>
              <input type="number" min={0} max={100} value={settings.highRiskScoreThreshold}
                onChange={(e) => updateField("highRiskScoreThreshold", parseInt(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Medium Risk Threshold (score below this = medium risk)</label>
              <input type="number" min={0} max={100} value={settings.mediumRiskScoreThreshold}
                onChange={(e) => updateField("mediumRiskScoreThreshold", parseInt(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-5">Feature Flags</h3>
          <div className="space-y-4">
            {[
              { key: "adaptiveQuizEnabled" as const, label: "Adaptive Quiz Engine", description: "Enable AI-powered adaptive difficulty for quizzes" },
              { key: "aiRecommendationsEnabled" as const, label: "AI Recommendations", description: "Use AI to recommend programs to learners during onboarding" },
              { key: "geminiFeedbackEnabled" as const, label: "Gemini Quiz Feedback", description: "Generate personalized AI feedback after quiz submissions" },
              { key: "demoModeEnabled" as const, label: "Demo Mode", description: "Show demo data when live services are unavailable" },
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{description}</p>
                </div>
                <button type="button" onClick={() => updateField(key, !settings[key])}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings[key] ? "bg-[#008F11]" : "bg-gray-200"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[key] ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#008F11] text-white rounded-lg text-sm font-medium hover:bg-[#007a0f] disabled:opacity-50">
            {saved ? <CheckCircle className="w-4 h-4" /> : saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : saving ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
