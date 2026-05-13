"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Loader2, Calendar, Plus, Search, X } from "lucide-react";
import { Cohort } from "@/lib/models/cohort.model";

export default function AdminCohortsPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", programId: "", instructorId: "", startDate: "", endDate: "", capacity: "30", status: "upcoming" });

  useEffect(() => {
    fetch("/api/admin/cohorts")
      .then((r) => r.json())
      .then((res) => { if (res.success) setCohorts(res.cohorts); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = cohorts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cohorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, capacity: parseInt(form.capacity) }),
      });
      const data = await res.json();
      if (data.success) {
        setCohorts((prev) => [data.cohort, ...prev]);
        setShowForm(false);
        setForm({ name: "", programId: "", instructorId: "", startDate: "", endDate: "", capacity: "30", status: "upcoming" });
      }
    } finally {
      setSaving(false);
    }
  }

  const statusColor = (s: Cohort["status"]) =>
    s === "active" ? "bg-green-100 text-green-700" : s === "completed" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500";

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#008F11]" />
        <p className="text-gray-500">Loading cohorts...</p>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-[#008F11]" />
              <h1 className="text-2xl font-bold text-gray-900">Cohorts</h1>
            </div>
            <p className="text-gray-500 text-sm">{cohorts.length} cohorts total</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#008F11] text-white rounded-lg text-sm hover:bg-[#007a0f] transition-colors">
            <Plus className="w-4 h-4" /> New Cohort
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">New Cohort</h3>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Cohort Name *", key: "name", type: "text", required: true },
                { label: "Program ID", key: "programId", type: "text" },
                { label: "Start Date", key: "startDate", type: "date" },
                { label: "End Date", key: "endDate", type: "date" },
                { label: "Capacity", key: "capacity", type: "number" },
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
                  <input type={type} required={required} value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30">
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={saving}
                  className="px-4 py-2 bg-[#008F11] text-white rounded-lg text-sm hover:bg-[#007a0f] disabled:opacity-50">
                  {saving ? "Creating..." : "Create Cohort"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cohorts..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{c.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(c.status)}`}>{c.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><p className="text-xs text-gray-400">Enrolled</p><p className="font-semibold text-gray-800">{c.enrolledCount}/{c.capacity}</p></div>
                {c.averageCompletion !== undefined && <div><p className="text-xs text-gray-400">Completion</p><p className="font-semibold text-[#008F11]">{c.averageCompletion}%</p></div>}
                {c.startDate && <div><p className="text-xs text-gray-400">Start</p><p className="text-gray-700">{new Date(c.startDate).toLocaleDateString()}</p></div>}
                {c.endDate && <div><p className="text-xs text-gray-400">End</p><p className="text-gray-700">{new Date(c.endDate).toLocaleDateString()}</p></div>}
              </div>
              {c.instructorName && <p className="text-xs text-gray-400 mt-3">Instructor: {c.instructorName}</p>}
              {c.programName && <p className="text-xs text-gray-400">Program: {c.programName}</p>}
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No cohorts found.</p>}
      </div>
    </AppShell>
  );
}
