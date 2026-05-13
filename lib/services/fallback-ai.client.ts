"use client";

import { LearningRoadmap, RoadmapWeek } from "@/lib/models/roadmap.model";

function getCareerReadinessScore(skillLevel: string, weightedScore: number): number {
  let base: number;
  switch (skillLevel) {
    case "advanced": base = 75 + Math.round(weightedScore * 0.15); break;
    case "intermediate": base = 60 + Math.round(weightedScore * 0.15); break;
    default: base = 45 + Math.round(weightedScore * 0.15);
  }
  return Math.min(base, 95);
}

function getRoadmapForGoal(goal: string): RoadmapWeek[] {
  const g = goal.toLowerCase();
  if (g.includes("data science") || g.includes("machine learning")) {
    return [
      { week: 1, module: "Python Foundations", status: "Completed", reason: "Required for all data science workflows." },
      { week: 2, module: "Pandas and Data Cleaning", status: "In Progress", reason: "Builds practical data handling skills." },
      { week: 3, module: "Machine Learning Basics", status: "AI Recommended", reason: "Matches the learner's primary goal." },
      { week: 4, module: "Model Evaluation", status: "Upcoming", reason: "Needed to understand model performance." },
      { week: 5, module: "Portfolio Project", status: "Locked", reason: "Consolidates all learned skills." },
    ];
  }
  return [
    { week: 1, module: "Programming Foundations", status: "Completed", reason: "Essential starting point." },
    { week: 2, module: "Core Concepts", status: "In Progress", reason: "Builds domain knowledge." },
    { week: 3, module: "Practical Application", status: "AI Recommended", reason: "Hands-on learning for your goal." },
    { week: 4, module: "Advanced Topics", status: "Upcoming", reason: "Deepens expertise." },
    { week: 5, module: "Capstone Project", status: "Locked", reason: "Demonstrates mastery." },
  ];
}

export function generateClientFallbackRoadmap(params: {
  skillLevel: string;
  primaryGoal: string;
  learningStyle: string;
  topCourse: string;
  quizAccuracy: number;
  quizWeightedScore: number;
}): LearningRoadmap {
  const careerReadiness = getCareerReadinessScore(params.skillLevel, params.quizWeightedScore);
  const roadmap = getRoadmapForGoal(params.primaryGoal);
  return {
    roadmapTitle: `Personalized ${params.primaryGoal} Roadmap`,
    summary: `You are best matched with ${params.topCourse} because your goal is ${params.primaryGoal}.`,
    nextBestLesson: roadmap[1]?.module || "Core Concepts",
    weakTopic: "Machine Learning Foundations",
    careerReadinessScore: careerReadiness,
    roadmap,
    mentorMessage: `Focus on completing ${roadmap[1]?.module || "current module"} before moving forward.`,
    instructorNote: `Monitor this learner's progress and assign targeted exercises.`,
    modelUsed: "fallback",
  };
}
