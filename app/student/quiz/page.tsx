"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AdaptiveQuizPanel } from "@/components/student/AdaptiveQuizPanel";
import { MetricCard } from "@/components/cards/MetricCard";
import { AdaptiveQuizResult } from "@/lib/models/quiz.model";
import { Brain, Zap, TrendingUp } from "lucide-react";

export default function QuizPage() {
  const [initialResult, setInitialResult] = useState<AdaptiveQuizResult | null>(null);
  const [latestResult, setLatestResult] = useState<AdaptiveQuizResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("onboardingResult");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.quiz) setInitialResult(data.quiz);
      } catch { /* ignore */ }
    }
  }, []);

  const displayResult = latestResult || initialResult;

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-5 h-5 text-[#008F11]" />
            <h1 className="text-2xl font-bold text-gray-900">Adaptive Quiz</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Answer questions and let AI adapt the difficulty to your performance.
            Mark each answer correct or incorrect, then click Adapt.
          </p>
        </div>

        {/* Current stats */}
        {displayResult && (
          <div className="grid grid-cols-3 gap-3">
            <MetricCard
              title="Next Difficulty"
              value={displayResult.nextDifficulty}
              icon={Zap}
              tone={displayResult.nextDifficulty === "hard" ? "danger" : displayResult.nextDifficulty === "easy" ? "success" : "warning"}
            />
            <MetricCard
              title="Accuracy"
              value={`${displayResult.accuracy}%`}
              icon={Brain}
              tone={displayResult.accuracy >= 70 ? "success" : "warning"}
            />
            <MetricCard
              title="Weighted Score"
              value={`${displayResult.weightedScore}%`}
              icon={TrendingUp}
              tone={displayResult.weightedScore >= 65 ? "success" : "warning"}
            />
          </div>
        )}

        {/* Quiz panel */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#008F11]" />
            5-Question Sample Quiz
          </h2>
          <AdaptiveQuizPanel
            initialResult={initialResult}
            onResult={setLatestResult}
          />
        </div>

        {/* How it works */}
        <div className="bg-[#0B1F33]/5 rounded-xl p-5 border border-[#0B1F33]/10">
          <h3 className="font-semibold text-gray-800 text-sm mb-2">How Adaptive Difficulty Works</h3>
          <ul className="space-y-1.5 text-sm text-gray-600">
            <li className="flex items-start gap-2"><span className="text-[#008F11] font-bold">→</span> AI analyses your correct/incorrect answers</li>
            <li className="flex items-start gap-2"><span className="text-[#008F11] font-bold">→</span> Calculates weighted score based on difficulty levels</li>
            <li className="flex items-start gap-2"><span className="text-[#008F11] font-bold">→</span> Recommends easy/medium/hard for the next round</li>
            <li className="flex items-start gap-2"><span className="text-[#008F11] font-bold">→</span> Powered by the atomcamp AI quiz engine</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
