"use client";

import { useState } from "react";
import { QuizHistoryItem, AdaptiveQuizResult } from "@/lib/models/quiz.model";
import { MOCK_QUESTIONS } from "@/lib/data/demoQuiz";
import { Brain, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getDifficultyColor } from "@/lib/utils/score";

interface AdaptiveQuizPanelProps {
  initialResult?: AdaptiveQuizResult | null;
  onResult?: (result: AdaptiveQuizResult) => void;
}

export function AdaptiveQuizPanel({ initialResult, onResult }: AdaptiveQuizPanelProps) {
  const [answers, setAnswers] = useState<Record<number, boolean>>({
    1: true, 2: true, 3: false, 4: true, 5: false,
  });
  const [result, setResult] = useState<AdaptiveQuizResult | null>(initialResult || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleAnswer = (id: number) => {
    setAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const runAdaptation = async () => {
    setLoading(true);
    setError(null);
    try {
      const history: QuizHistoryItem[] = MOCK_QUESTIONS.map((q) => ({
        question_id: q.id,
        difficulty: q.difficulty,
        correct: answers[q.id] ?? false,
      }));

      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history }),
      });
      const data = await res.json();

      if (data.success && data.result) {
        setResult(data.result);
        onResult?.(data.result);
      } else {
        setError("Failed to adapt quiz difficulty.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const correctCount = Object.values(answers).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Questions */}
      <div className="space-y-3">
        {MOCK_QUESTIONS.map((q) => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", getDifficultyColor(q.difficulty))}>
                    {q.difficulty}
                  </span>
                  <span className="text-xs text-gray-400">{q.topic}</span>
                </div>
                <p className="text-sm text-gray-800 font-medium">Q{q.id}. {q.text}</p>
              </div>
              <button
                onClick={() => toggleAnswer(q.id)}
                className="flex-shrink-0 mt-1"
              >
                {answers[q.id] ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Score summary */}
      <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {correctCount}/{MOCK_QUESTIONS.length} correct
        </span>
        <span className="text-sm font-semibold text-gray-800">
          {Math.round((correctCount / MOCK_QUESTIONS.length) * 100)}% accuracy
        </span>
      </div>

      {/* Action button */}
      <button
        onClick={runAdaptation}
        disabled={loading}
        className="w-full bg-[#008F11] hover:bg-[#006B0D] disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Adapting Difficulty...</>
        ) : (
          <><Brain className="w-4 h-4" /> Adapt Next Difficulty</>
        )}
      </button>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
      )}

      {/* Result */}
      {result && (
        <div className="bg-gradient-to-br from-[#008F11]/5 to-[#B7FF4A]/10 rounded-xl border border-[#008F11]/20 p-5">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#008F11]" />
            AI Adaptation Result
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-xs text-gray-400">Next Difficulty</p>
              <p className={cn("text-sm font-bold mt-0.5 capitalize", getDifficultyColor(result.nextDifficulty).split(" ")[0])}>
                {result.nextDifficulty}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-xs text-gray-400">Accuracy</p>
              <p className="text-sm font-bold mt-0.5 text-gray-800">{result.accuracy}%</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-xs text-gray-400">Weighted Score</p>
              <p className="text-sm font-bold mt-0.5 text-gray-800">{result.weightedScore}%</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100 col-span-1">
              <p className="text-xs text-gray-400">Source</p>
              <p className="text-xs font-medium mt-0.5 text-gray-600 capitalize">{result.source}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3 bg-white rounded-lg p-3 border border-gray-100">
            💡 {result.message}
          </p>
        </div>
      )}
    </div>
  );
}
