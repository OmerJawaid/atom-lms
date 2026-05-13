"use client";

import { useState } from "react";
import { MessageSquare, Send, Loader2, Bot } from "lucide-react";

interface AIMentorPanelProps {
  profile?: { skillLevel: string; primaryGoal: string; learningStyle: string };
  topCourse?: string;
  weakTopic?: string;
  quizAccuracy?: number;
}

const QUICK_PROMPTS = [
  "Explain my weak topic",
  "Give me 3 practice tasks",
  "What should I study next?",
  "How can I improve my score?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIMentorPanel({ profile, topCourse, weakTopic, quizAccuracy }: AIMentorPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm your AI learning mentor powered by Gemini. I'm here to help you succeed in ${profile?.primaryGoal || "your learning journey"}. Ask me anything about your roadmap, weak topics, or study strategies!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMsg: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          topCourse,
          weakTopic,
          quizAccuracy,
          prompt,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || "I couldn't generate a response. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gradient-to-r from-[#008F11]/5 to-[#B7FF4A]/10">
        <div className="w-9 h-9 rounded-xl bg-[#008F11]/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-[#008F11]" />
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">AI Learning Mentor</p>
          <p className="text-xs text-gray-400">Powered by Gemini</p>
        </div>
        <div className="ml-auto">
          <span className="text-xs bg-[#B7FF4A]/30 text-[#4a7c00] px-2 py-1 rounded-full font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-[#008F11] text-white"
                : "bg-gray-50 text-gray-800 border border-gray-100"
            }`}>
              {msg.role === "assistant" && (
                <div className="flex items-center gap-1.5 mb-1">
                  <MessageSquare className="w-3 h-3 text-[#008F11]" />
                  <span className="text-xs text-[#008F11] font-medium">Mentor</span>
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#008F11]" />
              <span className="text-sm text-gray-500">Mentor is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick prompts */}
      <div className="px-4 pb-2 flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            disabled={loading}
            className="text-xs bg-gray-100 hover:bg-[#008F11]/10 text-gray-600 hover:text-[#008F11] px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask your AI mentor anything..."
            disabled={loading}
            className="flex-1 text-sm px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008F11]/30 focus:border-[#008F11] disabled:bg-gray-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="bg-[#008F11] hover:bg-[#006B0D] disabled:bg-gray-200 text-white p-2.5 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
