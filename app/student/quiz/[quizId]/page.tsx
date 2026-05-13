"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Question } from "@/lib/models/question.model";
import { QuizMeta } from "@/lib/data/demoQuizzes";

interface PageProps { params: Promise<{ quizId: string }> }

interface QuizResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  weightedScore: number;
  nextDifficulty: string;
  passed: boolean;
  aiFeedback: string;
  weakTopics: string[];
  answers: Array<{ questionId: string; isCorrect: boolean; selectedAnswer: string; correctAnswer: string }>;
}

export default function QuizRunnerPage({ params }: PageProps) {
  const { quizId } = use(params);
  const [quiz, setQuiz] = useState<QuizMeta | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [startedAt] = useState(new Date().toISOString());

  useEffect(() => {
    fetch(`/api/quizzes/${quizId}`)
      .then((r) => r.json())
      .then((d) => { setQuiz(d.quiz); setQuestions(d.questions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [quizId]);

  function selectAnswer(questionId: string, value: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    const studentId = typeof window !== "undefined" ? (localStorage.getItem("studentId") || "demo-student") : "demo-student";
    try {
      const res = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, answers, startedAt }),
      });
      const data = await res.json();
      setResult(data.result);
      setSubmitted(true);
    } catch (err) {
      console.error("Submit failed", err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <AppShell><div className="text-center text-gray-500 py-16 animate-pulse">Loading quiz...</div></AppShell>;
  if (!quiz) return <AppShell><div className="text-center text-red-500 py-16">Quiz not found.</div></AppShell>;

  const current = questions[currentIdx];
  const answered = Object.keys(answers).length;
  const allAnswered = answered === questions.length;

  if (submitted && result) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto">
          <div className={`bg-white rounded-xl shadow-sm border-2 p-8 text-center mb-5 ${result.passed ? "border-green-300" : "border-red-200"}`}>
            <div className="text-5xl mb-3">{result.passed ? "🎉" : "📚"}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{result.passed ? "Quiz Passed!" : "Keep Practicing"}</h2>
            <p className="text-gray-500 text-sm mb-5">{quiz.title}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="bg-gray-50 rounded-lg p-3"><div className="text-2xl font-bold text-indigo-600">{result.accuracy}%</div><div className="text-xs text-gray-500">Accuracy</div></div>
              <div className="bg-gray-50 rounded-lg p-3"><div className="text-2xl font-bold text-green-600">{result.correctCount}/{result.totalQuestions}</div><div className="text-xs text-gray-500">Correct</div></div>
              <div className="bg-gray-50 rounded-lg p-3"><div className="text-2xl font-bold text-purple-600">{result.weightedScore}%</div><div className="text-xs text-gray-500">Weighted</div></div>
              <div className="bg-gray-50 rounded-lg p-3"><div className="text-xl font-bold text-amber-600 capitalize">{result.nextDifficulty}</div><div className="text-xs text-gray-500">Next Level</div></div>
            </div>
            {result.aiFeedback && (
              <div className="bg-indigo-50 rounded-lg p-4 text-left mb-4">
                <p className="text-xs font-semibold text-indigo-700 mb-1">🤖 AI Feedback</p>
                <p className="text-sm text-indigo-900 leading-relaxed">{result.aiFeedback}</p>
              </div>
            )}
            {result.weakTopics.length > 0 && (
              <div className="text-left mb-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">Topics to review:</p>
                <div className="flex flex-wrap gap-2">
                  {result.weakTopics.map((t) => <span key={t} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full">{t}</span>)}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 mb-5">
            <h3 className="font-semibold text-gray-900">Answer Review</h3>
            {questions.map((q, i) => {
              const ans = result.answers.find((a) => a.questionId === q.id);
              return (
                <div key={q.id} className={`bg-white rounded-lg border p-4 ${ans?.isCorrect ? "border-green-200" : "border-red-200"}`}>
                  <p className="text-sm font-medium text-gray-800 mb-1"><span className="text-gray-400 mr-2">Q{i + 1}.</span>{q.questionText}</p>
                  <p className={`text-xs font-semibold ${ans?.isCorrect ? "text-green-700" : "text-red-700"}`}>
                    Your answer: {ans?.selectedAnswer || "Not answered"} {ans?.isCorrect ? "✓" : "✗"}
                  </p>
                  {!ans?.isCorrect && <p className="text-xs text-gray-600 mt-0.5">Correct: {q.correctAnswer}</p>}
                  {q.explanation && <p className="text-xs text-gray-400 mt-1 italic">{q.explanation}</p>}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Link href={`/student/courses/${quiz.courseId}`} className="flex-1">
              <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Back to Course</button>
            </Link>
            <button onClick={() => { setSubmitted(false); setAnswers({}); setCurrentIdx(0); setResult(null); }} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
              Retake Quiz
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-xs text-gray-500">{quiz.timeLimitMinutes} min • {questions.length} questions</p>
          </div>
          <div className="text-sm text-gray-500">{answered}/{questions.length} answered</div>
        </div>

        <div className="h-2 bg-gray-200 rounded-full mb-5 overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </div>

        {current && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{current.difficulty}</span>
              {current.topic && <span className="text-xs text-gray-400">{current.topic}</span>}
              <span className="text-xs text-gray-400 ml-auto">Q{currentIdx + 1} of {questions.length}</span>
            </div>
            <p className="text-gray-900 font-medium mb-5 leading-relaxed">{current.questionText}</p>
            <div className="space-y-2.5">
              {current.options.map((opt) => {
                const selected = answers[current.id] === opt.value;
                return (
                  <button
                    key={opt.label}
                    onClick={() => selectAnswer(current.id, opt.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm ${selected ? "border-indigo-500 bg-indigo-50 text-indigo-900" : "border-gray-200 hover:border-indigo-200 text-gray-700"}`}
                  >
                    <span className="font-semibold mr-2">{opt.label}.</span>{opt.value}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3 mb-4">
          <button onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))} disabled={currentIdx === 0} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg disabled:opacity-40 hover:bg-gray-200">← Prev</button>
          {currentIdx < questions.length - 1 ? (
            <button onClick={() => setCurrentIdx((p) => p + 1)} className="flex-1 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium">Next →</button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting || !allAnswered} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium">
              {submitting ? "Grading..." : allAnswered ? "Submit Quiz" : `Answer all (${answered}/${questions.length})`}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, i) => (
            <button key={q.id} onClick={() => setCurrentIdx(i)} className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${i === currentIdx ? "bg-indigo-600 text-white" : answers[q.id] ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
