import { NextResponse } from "next/server";
import { getAllAttempts } from "@/lib/services/quiz.service";
import { getCourses } from "@/lib/services/course.service";

export async function GET() {
  try {
    const [attempts, courses] = await Promise.all([getAllAttempts(), getCourses()]);

    const coursePerformance = courses.map((c) => {
      const courseAttempts = attempts.filter((a) => {
        const quiz = a.quizId;
        return quiz.startsWith(c.id.substring(0, 8));
      });
      return {
        courseId: c.id,
        courseName: c.title,
        attempts: courseAttempts.length,
        avgAccuracy: courseAttempts.length ? Math.round(courseAttempts.reduce((s, a) => s + a.accuracy, 0) / courseAttempts.length) : 0,
        passRate: courseAttempts.length ? Math.round(courseAttempts.filter((a) => a.passed).length / courseAttempts.length * 100) : 0,
      };
    });

    const weeklyAttempts = [
      { week: "Week 1", attempts: 12, avgScore: 62 },
      { week: "Week 2", attempts: 18, avgScore: 67 },
      { week: "Week 3", attempts: 24, avgScore: 71 },
      { week: "Week 4", attempts: 31, avgScore: 74 },
    ];

    const weakTopicsMap: Record<string, number> = {};
    attempts.forEach((a) => {
      a.weakTopics.forEach((t) => {
        weakTopicsMap[t] = (weakTopicsMap[t] || 0) + 1;
      });
    });
    const topWeakTopics = Object.entries(weakTopicsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([topic, count]) => ({ topic, count }));

    const difficultyBreakdown = [
      { difficulty: "Easy", correct: 78, wrong: 22 },
      { difficulty: "Medium", correct: 62, wrong: 38 },
      { difficulty: "Hard", correct: 44, wrong: 56 },
    ];

    return NextResponse.json({ success: true, coursePerformance, weeklyAttempts, topWeakTopics, difficultyBreakdown });
  } catch (err) {
    console.error("[api/instructor/analytics] GET error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}
