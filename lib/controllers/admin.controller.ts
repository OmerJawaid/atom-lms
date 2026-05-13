import { AdminAnalytics } from "@/lib/models/analytics.model";
import { Student } from "@/lib/models/student.model";
import { getStudents, getRoadmaps, getQuizAttempts } from "@/lib/services/supabase.service";
import { computeAdminAnalytics } from "@/lib/services/analytics.service";
import { DEMO_STUDENTS, DEMO_QUIZ_ATTEMPTS } from "@/lib/data/demoStudents";
import { DEMO_ROADMAPS, DEMO_ADMIN_ANALYTICS } from "@/lib/data/demoAnalytics";

export async function getAdminAnalytics(): Promise<{
  data: AdminAnalytics;
  usingDemoData: boolean;
}> {
  let students: Student[] = [];
  let roadmapMap: Record<string, { weakTopic: string; careerReadinessScore: number }> = {};
  let quizMap: Record<string, { accuracy: number }> = {};
  let usingDemoData = false;

  const [studentsData, roadmapsData, quizData] = await Promise.all([
    getStudents(),
    getRoadmaps(),
    getQuizAttempts(),
  ]);

  if (studentsData && studentsData.length > 0) {
    students = (studentsData as Record<string, unknown>[]).map((s) => ({
      id: s.id as string,
      name: s.name as string,
      email: s.email as string,
      skillLevel: s.skill_level as "beginner" | "intermediate" | "advanced",
      primaryGoal: s.primary_goal as string,
      learningStyle: s.learning_style as string,
      confidenceScore: s.confidence_score as number,
      preferredCourse: s.preferred_course as string,
      careerReadinessScore: s.career_readiness_score as number,
    }));

    if (roadmapsData) {
      (roadmapsData as Record<string, unknown>[]).forEach((rm) => {
        roadmapMap[rm.student_id as string] = {
          weakTopic: rm.weak_topic as string,
          careerReadinessScore: rm.career_readiness_score as number || 0,
        };
      });
    }

    if (quizData) {
      (quizData as Record<string, unknown>[]).forEach((q) => {
        quizMap[q.student_id as string] = { accuracy: q.accuracy as number || 0 };
      });
    }
  } else {
    usingDemoData = true;
    students = DEMO_STUDENTS;
    Object.entries(DEMO_ROADMAPS).forEach(([id, rm]) => {
      roadmapMap[id] = {
        weakTopic: rm.weakTopic,
        careerReadinessScore: rm.careerReadinessScore,
      };
    });
    DEMO_QUIZ_ATTEMPTS.forEach((q) => {
      quizMap[q.studentId] = { accuracy: q.accuracy };
    });

    return { data: DEMO_ADMIN_ANALYTICS, usingDemoData: true };
  }

  const data = computeAdminAnalytics(students, roadmapMap, quizMap);
  return { data, usingDemoData };
}
