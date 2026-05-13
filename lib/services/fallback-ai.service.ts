import { LearningRoadmap, RoadmapWeek } from "@/lib/models/roadmap.model";

interface FallbackInput {
  skillLevel: string;
  primaryGoal: string;
  learningStyle: string;
  topCourse: string;
  quizAccuracy: number;
  quizWeightedScore: number;
}

function getCareerReadinessScore(skillLevel: string, weightedScore: number): number {
  let base: number;
  switch (skillLevel) {
    case "advanced": base = 75 + Math.round(weightedScore * 0.15); break;
    case "intermediate": base = 60 + Math.round(weightedScore * 0.15); break;
    default: base = 45 + Math.round(weightedScore * 0.15);
  }
  return Math.min(base, 95);
}

function getRoadmapForGoal(goal: string, skillLevel: string): RoadmapWeek[] {
  const goalLower = goal.toLowerCase();

  if (goalLower.includes("data science") || goalLower.includes("machine learning")) {
    return [
      { week: 1, module: "Python Foundations", status: "Completed", reason: "Required for all data science workflows." },
      { week: 2, module: "Pandas and Data Cleaning", status: "In Progress", reason: "Builds practical data handling skills." },
      { week: 3, module: "Machine Learning Basics", status: "AI Recommended", reason: "Matches the learner's primary goal." },
      { week: 4, module: "Model Evaluation", status: "Upcoming", reason: "Needed to understand model performance." },
      { week: 5, module: "Portfolio Project", status: "Locked", reason: "Consolidates all learned skills into a real project." },
    ];
  }

  if (goalLower.includes("artificial intelligence") || goalLower.includes("ai engineer")) {
    return [
      { week: 1, module: "Python Foundations", status: "Completed", reason: "Core language for AI development." },
      { week: 2, module: "ML Basics", status: "In Progress", reason: "Foundation for deep learning concepts." },
      { week: 3, module: "Deep Learning", status: "AI Recommended", reason: "Directly aligns with AI engineering goals." },
      { week: 4, module: "NLP and Computer Vision", status: "Upcoming", reason: "Key specializations for AI engineers." },
      { week: 5, module: "AI Project", status: "Locked", reason: "Applies advanced AI skills to a real problem." },
    ];
  }

  if (goalLower.includes("business analytics") || goalLower.includes("business")) {
    return [
      { week: 1, module: "Excel Analytics", status: "Completed", reason: "Fundamental business data tool." },
      { week: 2, module: "SQL Basics", status: "In Progress", reason: "Essential for querying business databases." },
      { week: 3, module: "Power BI Dashboards", status: "AI Recommended", reason: "High-demand skill for business analysts." },
      { week: 4, module: "Business Decision Making", status: "Upcoming", reason: "Applies analytics to real decisions." },
      { week: 5, module: "Analytics Case Study", status: "Locked", reason: "Demonstrates business value through data." },
    ];
  }

  if (goalLower.includes("cloud") || goalLower.includes("aws") || goalLower.includes("devops")) {
    return [
      { week: 1, module: "Cloud Fundamentals", status: "Completed", reason: "Introduction to cloud concepts and providers." },
      { week: 2, module: "AWS Basics", status: "In Progress", reason: "Core AWS services and architecture." },
      { week: 3, module: "Deployment", status: "AI Recommended", reason: "Practical cloud deployment workflows." },
      { week: 4, module: "DevOps Workflow", status: "Upcoming", reason: "CI/CD and infrastructure automation." },
      { week: 5, module: "Cloud Project", status: "Locked", reason: "End-to-end cloud architecture project." },
    ];
  }

  if (goalLower.includes("web") || goalLower.includes("frontend") || goalLower.includes("fullstack")) {
    return [
      { week: 1, module: "HTML/CSS Basics", status: "Completed", reason: "Foundation of web development." },
      { week: 2, module: "JavaScript", status: "In Progress", reason: "Core programming language for the web." },
      { week: 3, module: "React", status: "AI Recommended", reason: "Most in-demand frontend framework." },
      { week: 4, module: "Backend APIs", status: "Upcoming", reason: "Completes the full-stack skill set." },
      { week: 5, module: "Full Stack Project", status: "Locked", reason: "Portfolio-ready project combining all skills." },
    ];
  }

  // Default
  return [
    { week: 1, module: "Programming Foundations", status: "Completed", reason: "Essential starting point for any tech path." },
    { week: 2, module: "Core Concepts", status: "In Progress", reason: "Builds domain-specific knowledge." },
    { week: 3, module: "Practical Application", status: "AI Recommended", reason: "Hands-on learning for your goal." },
    { week: 4, module: "Advanced Topics", status: "Upcoming", reason: "Deepens expertise in the chosen field." },
    { week: 5, module: "Capstone Project", status: "Locked", reason: "Demonstrates mastery to employers." },
  ];
}

function getWeakTopic(goal: string): string {
  const goalLower = goal.toLowerCase();
  if (goalLower.includes("data science") || goalLower.includes("machine learning")) return "Machine Learning Foundations";
  if (goalLower.includes("artificial intelligence")) return "Deep Learning Architecture";
  if (goalLower.includes("business")) return "SQL for Analytics";
  if (goalLower.includes("cloud")) return "Cloud Architecture";
  if (goalLower.includes("web")) return "Backend API Design";
  return "Core Concepts";
}

export function generateFallbackRoadmap(input: FallbackInput): LearningRoadmap {
  const careerReadiness = getCareerReadinessScore(input.skillLevel, input.quizWeightedScore);
  const roadmap = getRoadmapForGoal(input.primaryGoal, input.skillLevel);
  const weakTopic = getWeakTopic(input.primaryGoal);

  const goalDisplay = input.primaryGoal || "your chosen field";
  const skillDisplay = input.skillLevel || "beginner";

  return {
    roadmapTitle: `Personalized ${goalDisplay.charAt(0).toUpperCase() + goalDisplay.slice(1)} Roadmap`,
    summary: `You are best matched with ${input.topCourse} because your goal is ${goalDisplay}. Your ${skillDisplay} skill level means you'll start with foundational concepts and build toward advanced applications.`,
    nextBestLesson: roadmap[1]?.module || roadmap[0]?.module || "Python Foundations",
    weakTopic,
    careerReadinessScore: careerReadiness,
    roadmap,
    mentorMessage: `Focus on completing ${roadmap[1]?.module || "the current module"} before moving forward. Based on your quiz performance (${input.quizAccuracy}% accuracy), practice more ${weakTopic} exercises.`,
    instructorNote: `Monitor this learner's progress in ${weakTopic} and assign targeted exercises. Quiz accuracy of ${input.quizAccuracy}% suggests ${input.quizAccuracy < 60 ? "need for additional support" : "good progression"}.`,
    modelUsed: "fallback",
  };
}
