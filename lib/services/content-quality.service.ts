import { ContentQualityReview } from "@/lib/models/content-quality.model";
import { DEMO_CONTENT_QUALITY } from "@/lib/data/demoAdmin";
import { DEMO_COURSES } from "@/lib/models/course.model";
import { DEMO_LECTURES } from "@/lib/data/demoLectures";
import { DEMO_QUIZZES } from "@/lib/data/demoQuizzes";

export function computeQualityScore(params: {
  quizAvgScore?: number;
  lectureCompletionRate?: number;
  hasQuiz: boolean;
  contentLength?: number;
}): number {
  let score = 100;
  if (!params.hasQuiz) score -= 10;
  if (params.quizAvgScore !== undefined && params.quizAvgScore < 50) score -= 25;
  if (params.lectureCompletionRate !== undefined && params.lectureCompletionRate < 60) score -= 20;
  if (params.contentLength !== undefined && params.contentLength < 200) score -= 10;
  return Math.max(0, score);
}

export async function getContentQualityIssues(): Promise<ContentQualityReview[]> {
  return DEMO_CONTENT_QUALITY.map((issue) => {
    const course = DEMO_COURSES.find((c) => c.id === issue.courseId);
    const lecture = issue.lectureId ? DEMO_LECTURES.find((l) => l.id === issue.lectureId) : undefined;
    const quiz = issue.quizId ? DEMO_QUIZZES.find((q) => q.id === issue.quizId) : undefined;
    return {
      ...issue,
      courseName: course?.title || issue.courseName,
      lectureName: lecture?.title || issue.lectureName,
      quizName: quiz?.title || issue.quizName,
    };
  });
}

export function getQualityLevel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Good", color: "text-green-600" };
  if (score >= 60) return { label: "Needs Review", color: "text-yellow-600" };
  return { label: "Critical", color: "text-red-600" };
}
