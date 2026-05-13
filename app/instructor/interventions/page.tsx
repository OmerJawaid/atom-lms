"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";

interface Intervention {
  id: string;
  studentId?: string; student_id?: string;
  weakTopic?: string; weak_topic?: string;
  riskLevel?: string; risk_level?: string;
  recommendedAction?: string; recommended_action?: string;
  reason?: string;
  timeline?: string;
  status: string;
}

const RISK_STYLE: Record<string, string> = {
  high: "border-red-200 bg-red-50",
  medium: "border-yellow-200 bg-yellow-50",
  low: "border-green-200 bg-green-50",
};
const RISK_BADGE: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

export default function InstructorInterventionsPage() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ studentId: "", weakTopic: "", riskLevel: "medium", recommendedAction: "", reason: "", timeline: "1 week" });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    fetch("/api/instructor/interventions").then((r) => r.json()).then((d) => { setInterventions(d.interventions || []); setLoading(false); });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/instructor/interventions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setInterventions((p) => [data.intervention, ...p]);
        setSavedMsg("Intervention created!");
        setForm({ studentId: "", weakTopic: "", riskLevel: "medium", recommendedAction: "", reason: "", timeline: "1 week" });
        setTimeout(() => setSavedMsg(""), 3000);
      }
    } finally { setSaving(false); }
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Interventions</h1>
          <p className="text-sm text-gray-500">Flag at-risk students and assign follow-up actions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4">New Intervention</h3>
              {savedMsg && <div className="text-green-700 text-sm bg-green-50 rounded-lg px-3 py-2 mb-3">{savedMsg}</div>}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input value={form.studentId} onChange={(e) => setForm((p) => ({ ...p, studentId: e.target.value }))} placeholder="Student ID" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
                <input value={form.weakTopic} onChange={(e) => setForm((p) => ({ ...p, weakTopic: e.target.value }))} placeholder="Weak topic" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
                <select value={form.riskLevel} onChange={(e) => setForm((p) => ({ ...p, riskLevel: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>
                <textarea value={form.recommendedAction} onChange={(e) => setForm((p) => ({ ...p, recommendedAction: e.target.value }))} placeholder="Recommended action..." rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" required />
                <textarea value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} placeholder="Reason..." rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
                <input value={form.timeline} onChange={(e) => setForm((p) => ({ ...p, timeline: e.target.value }))} placeholder="Timeline" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                <button type="submit" disabled={saving} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? "Saving..." : "Create Intervention"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {loading ? <div className="animate-pulse h-40 bg-gray-100 rounded-xl" /> : interventions.map((inv) => {
              const risk = inv.riskLevel || inv.risk_level || "medium";
              const topic = inv.weakTopic || inv.weak_topic || "—";
              const action = inv.recommendedAction || inv.recommended_action || "—";
              const sid = inv.studentId || inv.student_id || "—";
              return (
                <div key={inv.id} className={`rounded-xl border p-4 ${RISK_STYLE[risk] || "bg-white border-gray-100"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${RISK_BADGE[risk] || "bg-gray-100 text-gray-600"}`}>{risk.toUpperCase()} RISK</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${inv.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{inv.status}</span>
                      </div>
                      <p className="font-medium text-gray-800 text-sm">Topic: {topic}</p>
                      <p className="text-xs text-gray-500 mb-1">Student: {sid.toString().substring(0, 12)}…</p>
                      <p className="text-sm text-gray-700 mt-1">{action}</p>
                      {inv.reason && <p className="text-xs text-gray-500 mt-1">Reason: {inv.reason}</p>}
                      {inv.timeline && <p className="text-xs text-gray-400 mt-0.5">Timeline: {inv.timeline}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
            {!loading && interventions.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">No interventions yet. Create one to flag at-risk students.</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
