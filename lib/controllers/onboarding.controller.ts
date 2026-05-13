import { OnboardingRequestSchema } from "@/lib/utils/validators";
import { profileStudent, recommendCourses, getAdaptiveQuizResult } from "@/lib/services/model-api.service";
import { generateLearningRoadmap } from "@/lib/services/gemini.service";
import * as supabase from "@/lib/services/supabase.service";
import { DEFAULT_QUIZ_HISTORY } from "@/lib/data/demoQuiz";
import { StudentProfile } from "@/lib/models/profile.model";
import { CourseRecommendation } from "@/lib/models/recommendation.model";
import { AdaptiveQuizResult, QuizHistoryItem } from "@/lib/models/quiz.model";
import { LearningRoadmap } from "@/lib/models/roadmap.model";

export interface OnboardingResult {
  success: boolean;
  studentId: string;
  student: { name: string; email: string };
  profile: StudentProfile;
  recommendations: CourseRecommendation[];
  quiz: AdaptiveQuizResult;
  roadmap: LearningRoadmap;
  fallbackUsed: { modelApi: boolean; gemini: boolean; supabase: boolean };
  error?: string;
}

export async function handleOnboarding(data: {
  name: string;
  email: string;
  text: string;
  quizHistory?: QuizHistoryItem[];
}): Promise<OnboardingResult> {
  const parsed = OnboardingRequestSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid input");
  }

  const { name, email, text, quizHistory } = parsed.data;

  // Run profile and recommend in parallel
  const [profileResult, recommendResult] = await Promise.all([
    profileStudent(text),
    recommendCourses(text),
  ]);

  const profile = profileResult;
  const recommendations = recommendResult.recommendations;

  // Merge profile data (recommendation may have richer profile)
  const mergedProfile: StudentProfile = {
    ...recommendResult.profile,
    source: recommendResult.profile.source,
  };

  // Quiz: use provided history or default
  const historyToUse = quizHistory && quizHistory.length > 0 ? quizHistory : DEFAULT_QUIZ_HISTORY;
  const quizResult = await getAdaptiveQuizResult(historyToUse);

  // Generate roadmap via Gemini
  const roadmap = await generateLearningRoadmap({
    studentText: text,
    profile: {
      skillLevel: mergedProfile.skillLevel,
      primaryGoal: mergedProfile.primaryGoal,
      learningStyle: mergedProfile.learningStyle,
      confidenceScore: mergedProfile.confidenceScore,
    },
    recommendations: recommendations.slice(0, 3).map((r) => ({
      title: r.title,
      similarityScore: r.similarityScore,
    })),
    quiz: {
      nextDifficulty: quizResult.nextDifficulty,
      accuracy: quizResult.accuracy,
      weightedScore: quizResult.weightedScore,
    },
  });

  // Save to Supabase (non-blocking, failure safe)
  let studentId = `local-${Date.now()}`;
  let supabaseFailed = false;

  const savedStudent = await supabase.saveStudent({
    name,
    email,
    inputText: text,
    skillLevel: mergedProfile.skillLevel,
    primaryGoal: mergedProfile.primaryGoal,
    learningStyle: mergedProfile.learningStyle,
    confidenceScore: mergedProfile.confidenceScore,
    preferredCourse: recommendations[0]?.title,
    careerReadinessScore: roadmap.careerReadinessScore,
  });

  if (savedStudent) {
    studentId = savedStudent.id;

    await Promise.all([
      supabase.saveRecommendations(
        studentId,
        recommendations.map((r, idx) => ({
          courseApiId: r.id,
          title: r.title,
          description: r.description,
          similarityScore: r.similarityScore,
          rank: idx + 1,
        }))
      ),
      supabase.saveQuizAttempt({
        studentId,
        history: historyToUse,
        nextDifficulty: quizResult.nextDifficulty,
        accuracy: quizResult.accuracy,
        weightedScore: quizResult.weightedScore,
        message: quizResult.message,
      }),
      supabase.saveRoadmap({
        studentId,
        roadmapTitle: roadmap.roadmapTitle,
        summary: roadmap.summary,
        nextBestLesson: roadmap.nextBestLesson,
        weakTopic: roadmap.weakTopic,
        careerReadinessScore: roadmap.careerReadinessScore,
        roadmap: roadmap.roadmap,
        mentorMessage: roadmap.mentorMessage,
        instructorNote: roadmap.instructorNote,
        modelUsed: roadmap.modelUsed,
      }),
    ]);
  } else {
    supabaseFailed = true;
  }

  return {
    success: true,
    studentId,
    student: { name, email },
    profile: mergedProfile,
    recommendations,
    quiz: quizResult,
    roadmap,
    fallbackUsed: {
      modelApi: mergedProfile.source === "fallback",
      gemini: roadmap.modelUsed === "fallback",
      supabase: supabaseFailed,
    },
  };
}
