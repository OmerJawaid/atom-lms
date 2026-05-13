import { AppShell } from "@/components/layout/AppShell";
import { OnboardingForm } from "@/components/student/OnboardingForm";
import { Sparkles, Brain, BookOpen, Map } from "lucide-react";

export default function OnboardingPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#008F11]/10 rounded-full px-3 py-1 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#008F11]" />
            <span className="text-xs font-semibold text-[#008F11]">AI-Powered Onboarding</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Build Your Adaptive Learning Path</h1>
          <p className="text-gray-500 text-sm">
            Tell us about your goals and our AI will profile your skills, recommend the best courses,
            and generate a personalized roadmap just for you.
          </p>
        </div>

        {/* What happens next */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Brain, label: "AI Profiling", desc: "Skill level & learning style", color: "text-[#008F11]", bg: "bg-[#008F11]/10" },
            { icon: BookOpen, label: "Course Match", desc: "Top 3 course recommendations", color: "text-blue-600", bg: "bg-blue-100" },
            { icon: Map, label: "Roadmap", desc: "Personalized learning path", color: "text-purple-600", bg: "bg-purple-100" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
                <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <OnboardingForm />
        </div>

        <p className="text-xs text-center text-gray-400 mt-4">
          Your data is used only to generate your personalized learning path. No account required.
        </p>
      </div>
    </AppShell>
  );
}
