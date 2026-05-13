import { AdminAnalytics, InstructorInsights, AtRiskStudent, WeakTopicItem, InterventionItem } from "@/lib/models/analytics.model";
import { Student } from "@/lib/models/student.model";
import { getRiskLevel } from "@/lib/utils/score";

export function computeAdminAnalytics(
  students: Student[],
  roadmapMap: Record<string, { weakTopic: string; careerReadinessScore: number }>,
  quizMap: Record<string, { accuracy: number }>
): AdminAnalytics {
  if (students.length === 0) {
    return {
      totalLearners: 0,
      averageConfidence: 0,
      averageCareerReadiness: 0,
      mostRecommendedCourse: "N/A",
      mostCommonGoal: "N/A",
      averageQuizAccuracy: 0,
      highRiskCount: 0,
      coursePerformance: [],
    };
  }

  const totalLearners = students.length;
  const avgConfidence = Math.round(
    students.reduce((sum, s) => sum + (s.confidenceScore || 0), 0) / totalLearners
  );
  const avgCareer = Math.round(
    students.reduce((sum, s) => {
      const rm = roadmapMap[s.id];
      return sum + (rm?.careerReadinessScore || s.careerReadinessScore || 0);
    }, 0) / totalLearners
  );

  const courseCounts: Record<string, number> = {};
  students.forEach((s) => {
    const course = s.preferredCourse || "Unknown";
    courseCounts[course] = (courseCounts[course] || 0) + 1;
  });
  const mostRecommendedCourse = Object.entries(courseCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const goalCounts: Record<string, number> = {};
  students.forEach((s) => {
    const goal = s.primaryGoal || "Unknown";
    goalCounts[goal] = (goalCounts[goal] || 0) + 1;
  });
  const mostCommonGoal = Object.entries(goalCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const quizAccuracies = students.map((s) => quizMap[s.id]?.accuracy || 0).filter((a) => a > 0);
  const avgQuizAccuracy = quizAccuracies.length > 0
    ? Math.round(quizAccuracies.reduce((a, b) => a + b, 0) / quizAccuracies.length)
    : 0;

  const highRiskCount = students.filter((s) => {
    const rm = roadmapMap[s.id];
    return getRiskLevel(s.confidenceScore || 0, rm?.careerReadinessScore || s.careerReadinessScore || 0) === "High";
  }).length;

  const coursePerf: Record<string, { count: number; totalScore: number }> = {};
  students.forEach((s) => {
    const course = s.preferredCourse || "Unknown";
    const score = s.careerReadinessScore || 0;
    if (!coursePerf[course]) coursePerf[course] = { count: 0, totalScore: 0 };
    coursePerf[course].count++;
    coursePerf[course].totalScore += score;
  });

  const coursePerformance = Object.entries(coursePerf).map(([course, data]) => ({
    course,
    count: data.count,
    avgScore: Math.round(data.totalScore / data.count),
  })).sort((a, b) => b.count - a.count);

  return {
    totalLearners,
    averageConfidence: avgConfidence,
    averageCareerReadiness: avgCareer,
    mostRecommendedCourse,
    mostCommonGoal,
    averageQuizAccuracy: avgQuizAccuracy,
    highRiskCount,
    coursePerformance,
  };
}

export function computeInstructorInsights(
  students: Student[],
  roadmapMap: Record<string, { weakTopic: string; instructorNote: string; careerReadinessScore: number }>
): InstructorInsights {
  const atRiskStudents: AtRiskStudent[] = students.map((s) => {
    const rm = roadmapMap[s.id];
    const careerScore = rm?.careerReadinessScore || s.careerReadinessScore || 0;
    const confidence = s.confidenceScore || 0;
    const riskLevel = getRiskLevel(confidence, careerScore);

    return {
      id: s.id,
      name: s.name,
      skillLevel: s.skillLevel || "beginner",
      primaryGoal: s.primaryGoal || "N/A",
      confidenceScore: confidence,
      weakTopic: rm?.weakTopic || "Core Concepts",
      riskLevel,
      recommendedAction: rm?.instructorNote || "Monitor progress and provide support.",
      careerReadinessScore: careerScore,
    };
  }).sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[a.riskLevel] - order[b.riskLevel];
  });

  const topicCounts: Record<string, number> = {};
  atRiskStudents.forEach((s) => {
    topicCounts[s.weakTopic] = (topicCounts[s.weakTopic] || 0) + 1;
  });
  const weakTopicHeatmap: WeakTopicItem[] = Object.entries(topicCounts)
    .map(([topic, count]) => ({
      topic,
      count,
      severity: count >= 3 ? "high" : count >= 2 ? "medium" : "low" as "high" | "medium" | "low",
    }))
    .sort((a, b) => b.count - a.count);

  const interventionSuggestions: InterventionItem[] = atRiskStudents
    .filter((s) => s.riskLevel !== "Low")
    .map((s) => ({
      studentName: s.name,
      action: s.recommendedAction,
      priority: s.riskLevel === "High" ? "urgent" : "moderate" as "urgent" | "moderate" | "low",
    }));

  return { atRiskStudents, weakTopicHeatmap, interventionSuggestions };
}
