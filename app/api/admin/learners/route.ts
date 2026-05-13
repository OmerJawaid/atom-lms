import { NextResponse } from "next/server";
import { getStudents } from "@/lib/services/student.service";
import { getAllAttempts } from "@/lib/services/quiz.service";

export async function GET() {
  try {
    const [students, attempts] = await Promise.all([getStudents(), getAllAttempts()]);
    const enriched = students.map((s) => {
      const studentAttempts = attempts.filter((a) => a.studentId === s.id);
      const avgScore = studentAttempts.length
        ? Math.round(studentAttempts.reduce((acc, a) => acc + a.score, 0) / studentAttempts.length)
        : 0;
      const readiness = s.careerReadinessScore ?? 0;
      const riskLevel = readiness < 50 ? "high" : readiness < 65 ? "medium" : "low";
      return { ...s, avgQuizScore: avgScore, quizAttempts: studentAttempts.length, riskLevel };
    });
    return NextResponse.json({ success: true, learners: enriched });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load learners" }, { status: 500 });
  }
}
