"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";

interface Submission {
  id: string;
  studentId: string;
  quizTitle?: string;
  accuracy: number;
  score: number;
  passed: boolean;
  nextDifficulty?: string;
  weakTopics: string[];
  submittedAt: string;
}

const DEMO: Submission[] = [
  { id: "1", studentId: "s1000000", quizTitle: "SQL Foundations Quiz", accuracy: 80, score: 80, passed: true, nextDifficulty: "hard", weakTopics: ["Window Functions"], submittedAt: new Date(Date.now() - 1800000).toISOString() },
  { id: "2", studentId: "s2000000", quizTitle: "ML Foundations Quiz", accuracy: 60, score: 60, passed: true, nextDifficulty: "medium", weakTopics: ["Regularization"], submittedAt: new Date(Date.now() - 5400000).toISOString() },
  { id: "3", studentId: "s3000000", quizTitle: "Neural Networks Quiz", accuracy: 40, score: 40, passed: false, nextDifficulty: "easy", weakTopics: ["Backpropagation", "Dropout"], submittedAt: new Date(Date.now() - 9000000).toISOString() },
  { id: "4", studentId: "s4000000", quizTitle: "Python Data Analysis Quiz", accuracy: 100, score: 100, passed: true, nextDifficulty: "hard", weakTopics: [], submittedAt: new Date(Date.now() - 12000000).toISOString() },
  { id: "5", studentId: "s5000000", quizTitle: "AWS Cloud Fundamentals Quiz", accuracy: 60, score: 60, passed: true, nextDifficulty: "medium", weakTopics: ["IAM", "S3"], submittedAt: new Date(Date.now() - 18000000).toISOString() },
];

export default function InstructorSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instructor/submissions").then((r) => r.json()).then((d) => { setSubmissions(d.submissions || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const display = submissions.length > 0 ? submissions : DEMO;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quiz Submissions</h1>
          <p className="text-sm text-gray-500">{display.length} recent submissions</p>
        </div>
        {loading && submissions.length === 0 ? <div className="animate-pulse h-40 bg-gray-100 rounded-xl" /> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Quiz</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Score</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Weak Topics</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Next Level</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {display.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">{s.studentId.substring(0, 8)}…</td>
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-[180px] truncate">{s.quizTitle || s.id}</td>
                    <td className="px-4 py-3 text-center font-bold" style={{ color: s.accuracy >= 70 ? "#16a34a" : s.accuracy >= 50 ? "#ca8a04" : "#dc2626" }}>{s.accuracy}%</td>
                    <td className="px-4 py-3 text-center"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{s.passed ? "Passed" : "Failed"}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.weakTopics.slice(0, 2).map((t) => <span key={t} className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded">{t}</span>)}
                        {s.weakTopics.length > 2 && <span className="text-xs text-gray-400">+{s.weakTopics.length - 2}</span>}
                        {s.weakTopics.length === 0 && <span className="text-xs text-gray-400">None</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-xs capitalize font-medium" style={{ color: s.nextDifficulty === "hard" ? "#dc2626" : s.nextDifficulty === "easy" ? "#16a34a" : "#ca8a04" }}>{s.nextDifficulty || "—"}</td>
                    <td className="px-4 py-3 text-right text-xs text-gray-400">{new Date(s.submittedAt).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
