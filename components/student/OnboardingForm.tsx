"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, CheckCircle, XCircle, User, Mail, BookOpen } from "lucide-react";
import { MOCK_QUESTIONS } from "@/lib/data/demoQuiz";
import { QuizHistoryItem } from "@/lib/models/quiz.model";
import { cn } from "@/lib/utils/cn";

export function OnboardingForm() {
  const router = useRouter();
  const [name, setName] = useState("Ali Khan");
  const [email, setEmail] = useState("ali@example.com");
  const [text, setText] = useState("I am a beginner and I want to learn data science and machine learning through practical projects.");
  const [answers, setAnswers] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState("");

  const loadingMessages = [
    "Profiling your learning style...",
    "Recommending the best courses...",
    "Adapting quiz difficulty...",
    "Generating your AI roadmap with Gemini...",
    "Saving your profile...",
  ];

  const toggleAnswer = (id: number) => {
    setAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let msgIdx = 0;
    setLoadingMsg(loadingMessages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setLoadingMsg(loadingMessages[msgIdx]);
    }, 1500);

    try {
      const quizHistory: QuizHistoryItem[] = MOCK_QUESTIONS.slice(0, 3).map((q) => ({
        question_id: q.id,
        difficulty: q.difficulty,
        correct: answers[q.id] ?? false,
      }));

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, text, quizHistory }),
      });

      const data = await res.json();

      if (data.success) {
        // Store in sessionStorage for dashboard
        sessionStorage.setItem("onboardingResult", JSON.stringify(data));
        router.push("/student/dashboard");
      } else {
        setError(data.message || "Failed to complete onboarding.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingMsg("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <User className="inline w-4 h-4 mr-1 text-gray-400" /> Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008F11]/30 focus:border-[#008F11] text-sm"
          placeholder="Enter your full name"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Mail className="inline w-4 h-4 mr-1 text-gray-400" /> Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008F11]/30 focus:border-[#008F11] text-sm"
          placeholder="your@email.com"
        />
      </div>

      {/* Learning statement */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <BookOpen className="inline w-4 h-4 mr-1 text-gray-400" /> Tell us about your learning goals
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008F11]/30 focus:border-[#008F11] text-sm resize-none"
          placeholder="Example: I am a beginner and I want to learn data science and machine learning through practical projects."
        />
        <p className="text-xs text-gray-400 mt-1">{text.length}/1000 characters</p>
      </div>

      {/* Mini quiz simulation */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-semibold text-gray-700">Quiz Simulation</label>
          <span className="text-xs bg-[#B7FF4A]/30 text-[#4a7c00] px-2 py-0.5 rounded-full font-medium">
            Helps calibrate difficulty
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-3">Mark each question as Correct or Incorrect:</p>
        <div className="space-y-2">
          {MOCK_QUESTIONS.slice(0, 3).map((q) => (
            <div key={q.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex-1 pr-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                    q.difficulty === "easy" ? "bg-green-100 text-green-700" :
                    q.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {q.difficulty}
                  </span>
                  <span className="text-xs text-gray-400">{q.topic}</span>
                </div>
                <p className="text-sm text-gray-700">{q.text}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleAnswer(q.id)}
                className="flex-shrink-0"
              >
                {answers[q.id] ? (
                  <CheckCircle className="w-7 h-7 text-green-500 hover:text-green-600 transition-colors" />
                ) : (
                  <XCircle className="w-7 h-7 text-red-400 hover:text-red-500 transition-colors" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#008F11] hover:bg-[#006B0D] disabled:bg-gray-300 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors text-base shadow-lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{loadingMsg}</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate My Adaptive Learning Path
          </>
        )}
      </button>
    </form>
  );
}
