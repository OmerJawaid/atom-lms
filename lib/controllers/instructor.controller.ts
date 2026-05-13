import { InstructorInsights } from "@/lib/models/analytics.model";
import { Student } from "@/lib/models/student.model";
import { getStudents, getRoadmaps } from "@/lib/services/supabase.service";
import { computeInstructorInsights } from "@/lib/services/analytics.service";
import { DEMO_STUDENTS } from "@/lib/data/demoStudents";
import { DEMO_ROADMAPS } from "@/lib/data/demoAnalytics";

export async function getInstructorInsights(): Promise<{
  data: InstructorInsights;
  usingDemoData: boolean;
}> {
  let students: Student[] = [];
  let roadmapMap: Record<string, { weakTopic: string; instructorNote: string; careerReadinessScore: number }> = {};
  let usingDemoData = false;

  // Try Supabase first
  const [studentsData, roadmapsData] = await Promise.all([getStudents(), getRoadmaps()]);

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
        const sid = rm.student_id as string;
        roadmapMap[sid] = {
          weakTopic: rm.weak_topic as string || "Core Concepts",
          instructorNote: rm.instructor_note as string || "Monitor student progress.",
          careerReadinessScore: rm.career_readiness_score as number || 0,
        };
      });
    }
  } else {
    usingDemoData = true;
    students = DEMO_STUDENTS;
    Object.entries(DEMO_ROADMAPS).forEach(([id, rm]) => {
      roadmapMap[id] = {
        weakTopic: rm.weakTopic,
        instructorNote: rm.instructorNote,
        careerReadinessScore: rm.careerReadinessScore,
      };
    });
  }

  const data = computeInstructorInsights(students, roadmapMap);
  return { data, usingDemoData };
}
