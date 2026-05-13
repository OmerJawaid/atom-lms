import { NextResponse } from "next/server";
import { getAllAttempts } from "@/lib/services/quiz.service";
import { DEMO_QUIZZES } from "@/lib/data/demoQuizzes";

export async function GET() {
  try {
    const attempts = await getAllAttempts();
    const enriched = attempts.map((a) => {
      const quiz = DEMO_QUIZZES.find((q) => q.id === a.quizId);
      return { ...a, quizTitle: quiz?.title || a.quizId };
    });
    return NextResponse.json({ success: true, submissions: enriched, total: enriched.length });
  } catch (err) {
    console.error("[api/instructor/submissions] GET error:", err);
    return NextResponse.json({ success: true, submissions: [], total: 0 });
  }
}
