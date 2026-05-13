"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DEMO_QUESTIONS } from "@/lib/data/demoQuestions";
import { DEMO_QUIZZES } from "@/lib/data/demoQuizzes";
import { Question } from "@/lib/models/question.model";

const DIFF_COLOR: Record<string, string> = { easy: "bg-green-100 text-green-700", medium: "bg-yellow-100 text-yellow-700", hard: "bg-red-100 text-red-700" };

export default function InstructorQuestionsPage() {
  const [questions] = useState<Question[]>(DEMO_QUESTIONS);
  const [filterQuiz, setFilterQuiz] = useState("all");
  const [filterDiff, setFilterDiff] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = questions.filter((q) => {
    if (filterQuiz !== "all" && q.quizId !== filterQuiz) return false;
    if (filterDiff !== "all" && q.difficulty !== filterDiff) return false;
    if (search && !q.questionText.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
            <p className="text-sm text-gray-500">{filtered.length} of {questions.length} questions</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions..." className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          <select value={filterQuiz} onChange={(e) => setFilterQuiz(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="all">All Quizzes</option>
            {DEMO_QUIZZES.map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
          </select>
          <select value={filterDiff} onChange={(e) => setFilterDiff(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="space-y-2">
          {filtered.map((q, i) => {
            const quiz = DEMO_QUIZZES.find((qz) => qz.id === q.quizId);
            return (
              <div key={q.id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xs text-gray-400 mt-0.5 shrink-0 w-6">{i + 1}.</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${DIFF_COLOR[q.difficulty]}`}>{q.difficulty}</span>
                      {q.topic && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{q.topic}</span>}
                      <span className="text-xs text-gray-400 truncate max-w-[160px]">{quiz?.title}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">{q.questionText}</p>
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {q.options.map((opt) => (
                        <span key={opt.label} className={`text-xs px-2 py-0.5 rounded ${opt.value === q.correctAnswer ? "bg-green-50 text-green-700 font-semibold" : "text-gray-500"}`}>
                          {opt.label}. {opt.value}
                        </span>
                      ))}
                    </div>
                    {q.explanation && <p className="text-xs text-indigo-600 mt-1.5 italic">💡 {q.explanation}</p>}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="text-center text-gray-400 py-12">No questions match your filters</div>}
        </div>
      </div>
    </AppShell>
  );
}
