import Link from "next/link";
import { Zap, Brain, BookOpen, BarChart3, GraduationCap, ArrowRight, CheckCircle } from "lucide-react";
import { ApiStatusBadges } from "@/components/landing/ApiStatusBadges";

const features = [
  {
    icon: GraduationCap,
    title: "Learner Profiling",
    description: "AI analyses natural language input to extract skill level, learning style, and goals",
    badge: "ngrok API",
    color: "bg-[#008F11]/10 text-[#008F11]",
  },
  {
    icon: BookOpen,
    title: "Course Recommendation",
    description: "Semantic matching engine recommends the best atomcamp courses for each learner",
    badge: "ngrok API",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: Brain,
    title: "Adaptive Quiz",
    description: "Quiz difficulty adapts in real-time based on student performance history",
    badge: "ngrok API",
    color: "bg-purple-100 text-purple-700",
  },
  {
    icon: BarChart3,
    title: "Instructor Intelligence",
    description: "At-risk student detection with AI-generated intervention recommendations",
    badge: "Gemini AI",
    color: "bg-yellow-100 text-yellow-700",
  },
];

const demoSteps = [
  "Fill in your name, email, and learning goals",
  "AI profiles your skill level and learning style",
  "Get personalized course recommendations",
  "Receive an adaptive learning roadmap via Gemini",
  "Explore instructor and admin dashboards",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F7F9F5]">
      {/* Header */}
      <header className="bg-[#0B1F33] text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#008F11] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Atom Adaptive Intelligence Hub</p>
              <p className="text-gray-400 text-xs">AI-powered LMS by atomcamp</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/instructor/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">
              Instructor
            </Link>
            <Link href="/admin/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">
              Admin
            </Link>
            <Link
              href="/student/onboarding"
              className="bg-[#008F11] hover:bg-[#006B0D] text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              Start Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0B1F33] to-[#123A5A] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#008F11]/20 border border-[#008F11]/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-[#B7FF4A]" />
            <span className="text-sm text-[#B7FF4A] font-medium">Hackathon Demo — atomcamp 2025</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Atom Adaptive{" "}
            <span className="text-[#B7FF4A]">Intelligence Hub</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            A Smart Adaptive LMS that profiles learners, recommends courses, adapts quiz difficulty,
            and generates personalized roadmaps using AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/student/onboarding"
              className="inline-flex items-center gap-2 bg-[#008F11] hover:bg-[#006B0D] text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg"
            >
              <Zap className="w-5 h-5" />
              Start Demo Now
            </Link>
            <Link
              href="/student/dashboard"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-4 rounded-xl text-base transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* API Status */}
      <section className="py-6 px-6 bg-[#123A5A] border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <ApiStatusBadges />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Features</h2>
            <p className="text-gray-500">Powered by external ngrok AI API + Google Gemini</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{f.description}</p>
                  <span className="text-xs font-semibold bg-[#008F11]/10 text-[#008F11] px-2.5 py-1 rounded-full">
                    {f.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo flow */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">3-Minute Demo Flow</h2>
            <p className="text-gray-500">Follow these steps to see the full AI pipeline</p>
          </div>
          <div className="space-y-3">
            {demoSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 bg-[#F7F9F5] rounded-xl p-4 border border-gray-100">
                <div className="w-7 h-7 rounded-full bg-[#008F11] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-[#008F11] flex-shrink-0" />
                  <p className="text-sm text-gray-700">{step}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/student/onboarding"
              className="inline-flex items-center gap-2 bg-[#008F11] hover:bg-[#006B0D] text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-md"
            >
              Start the Demo <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Role navigation */}
      <section className="py-12 px-6 bg-[#0B1F33]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-6">Explore All Dashboards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/student/courses" className="bg-white/10 hover:bg-white/20 rounded-xl p-5 border border-white/10 transition-all">
              <GraduationCap className="w-8 h-8 text-[#B7FF4A] mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">Course Catalog</h3>
              <p className="text-gray-400 text-sm">5 courses, 27 lectures, adaptive quizzes</p>
            </Link>
            <Link href="/instructor/dashboard" className="bg-white/10 hover:bg-white/20 rounded-xl p-5 border border-white/10 transition-all">
              <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">Instructor Workspace</h3>
              <p className="text-gray-400 text-sm">Courses, quizzes, submissions, analytics</p>
            </Link>
            <Link href="/admin/dashboard" className="bg-white/10 hover:bg-white/20 rounded-xl p-5 border border-white/10 transition-all">
              <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">Admin View</h3>
              <p className="text-gray-400 text-sm">Platform analytics, metrics</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
