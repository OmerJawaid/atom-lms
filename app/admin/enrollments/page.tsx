"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Loader2, UserPlus, Plus, Search, X } from "lucide-react";

interface EnrollmentRow {
  id: string;
  studentId: string; studentName: string;
  courseId: string; courseName: string;
  cohortId?: string;
  enrollmentStatus: string;
  paymentStatus: string;
  progressPercent: number;
  completionStatus: string;
  enrolledAt: string;
}

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ studentId: "", courseId: "", cohortId: "", paymentStatus: "demo" });

  useEffect(() => {
    fetch("/api/admin/enrollments")
      .then((r) => r.json())
      .then((res) => { if (res.success) setEnrollments(res.enrollments); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = enrollments.filter((e) =>
    e.studentName.toLowerCase().includes(search.toLowerCase()) ||
    e.courseName.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(evt: React.FormEvent) {
    evt.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setEnrollments((prev) => [{ ...data.enrollment, studentName: "New Learner", courseName: "Unknown" }, ...prev]);
        setShowForm(false);
        setForm({ studentId: "", courseId: "", cohortId: "", paymentStatus: "demo" });
      }
    } finally {
      setSaving(false);
    }
  }

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      paused: "bg-yellow-100 text-yellow-700",
      completed: "bg-blue-100 text-blue-700",
      dropped: "bg-red-100 text-red-700",
      not_started: "bg-gray-100 text-gray-500",
    };
    return map[s] || "bg-gray-100 text-gray-500";
  };

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#008F11]" />
        <p className="text-gray-500">Loading enrollments...</p>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UserPlus className="w-5 h-5 text-[#008F11]" />
              <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
            </div>
            <p className="text-gray-500 text-sm">{enrollments.length} enrollments total</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#008F11] text-white rounded-lg text-sm hover:bg-[#007a0f] transition-colors">
            <Plus className="w-4 h-4" /> Enroll Learner
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">New Enrollment</h3>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Learner ID *</label>
                <input required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} placeholder="s1000000-..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Course ID *</label>
                <input required value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} placeholder="c1000000-..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Cohort ID (optional)</label>
                <input value={form.cohortId} onChange={(e) => setForm({ ...form, cohortId: e.target.value })} placeholder="co100000-..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Payment Status</label>
                <select value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30">
                  <option value="demo">Demo</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="scholarship">Scholarship</option>
                </select>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={saving}
                  className="px-4 py-2 bg-[#008F11] text-white rounded-lg text-sm hover:bg-[#007a0f] disabled:opacity-50">
                  {saving ? "Enrolling..." : "Enroll"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by learner or course..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008F11]/30" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Learner</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Enrollment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Enrolled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{e.studentName}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{e.courseName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#008F11] rounded-full" style={{ width: `${e.progressPercent}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{e.progressPercent}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(e.enrollmentStatus)}`}>{e.enrollmentStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${e.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{e.paymentStatus}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No enrollments found.</p>}
        </div>
      </div>
    </AppShell>
  );
}
