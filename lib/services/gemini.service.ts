import { LearningRoadmap, GeminiRoadmapInput } from "@/lib/models/roadmap.model";
import { generateFallbackRoadmap } from "./fallback-ai.service";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let geminiClient: any = null;

async function getGeminiClient() {
  if (geminiClient) return geminiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "demo_gemini_api_key_replace_with_real_value") {
    return null;
  }
  try {
    const { GoogleGenAI } = await import("@google/genai");
    geminiClient = new GoogleGenAI({ apiKey });
    return geminiClient;
  } catch {
    return null;
  }
}

export async function generateLearningRoadmap(input: GeminiRoadmapInput): Promise<LearningRoadmap> {
  const client = await getGeminiClient();
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!client) {
    return generateFallbackRoadmap({
      skillLevel: input.profile.skillLevel,
      primaryGoal: input.profile.primaryGoal,
      learningStyle: input.profile.learningStyle,
      topCourse: input.recommendations[0]?.title || "Data Science Bootcamp",
      quizAccuracy: input.quiz.accuracy,
      quizWeightedScore: input.quiz.weightedScore,
    });
  }

  const prompt = `You are an AI learning advisor for atomcamp, an EdTech platform. Based on the learner profile below, generate a personalized learning roadmap.

LEARNER STATEMENT: "${input.studentText}"

PROFILE:
- Skill Level: ${input.profile.skillLevel}
- Primary Goal: ${input.profile.primaryGoal}
- Learning Style: ${input.profile.learningStyle}
- Confidence Score: ${input.profile.confidenceScore}%

TOP COURSE RECOMMENDATIONS:
${input.recommendations.map((r, i) => `${i + 1}. ${r.title} (Match Score: ${r.similarityScore}%)`).join("\n")}

QUIZ PERFORMANCE:
- Accuracy: ${input.quiz.accuracy}%
- Weighted Score: ${input.quiz.weightedScore}%
- Next Difficulty: ${input.quiz.nextDifficulty}

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "roadmapTitle": "string",
  "summary": "string (2-3 sentences explaining why this course matches the learner)",
  "nextBestLesson": "string",
  "weakTopic": "string",
  "careerReadinessScore": number (between 40-90 based on profile and quiz),
  "roadmap": [
    {"week": 1, "module": "string", "status": "Completed", "reason": "string"},
    {"week": 2, "module": "string", "status": "In Progress", "reason": "string"},
    {"week": 3, "module": "string", "status": "AI Recommended", "reason": "string"},
    {"week": 4, "module": "string", "status": "Upcoming", "reason": "string"},
    {"week": 5, "module": "string", "status": "Locked", "reason": "string"}
  ],
  "mentorMessage": "string (motivational, personalized advice)",
  "instructorNote": "string (for instructor about this student)"
}`;

  try {
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const text: string = response.text ?? "";
    if (!text) throw new Error("Empty Gemini response");

    const parsed = JSON.parse(text);

    return {
      roadmapTitle: parsed.roadmapTitle || "Personalized Learning Roadmap",
      summary: parsed.summary || "",
      nextBestLesson: parsed.nextBestLesson || "",
      weakTopic: parsed.weakTopic || "Core Concepts",
      careerReadinessScore: Number(parsed.careerReadinessScore) || 60,
      roadmap: parsed.roadmap || [],
      mentorMessage: parsed.mentorMessage || "",
      instructorNote: parsed.instructorNote || "",
      modelUsed: "gemini",
    };
  } catch (err) {
    console.error("[gemini] generateLearningRoadmap error:", err);
    return generateFallbackRoadmap({
      skillLevel: input.profile.skillLevel,
      primaryGoal: input.profile.primaryGoal,
      learningStyle: input.profile.learningStyle,
      topCourse: input.recommendations[0]?.title || "Data Science Bootcamp",
      quizAccuracy: input.quiz.accuracy,
      quizWeightedScore: input.quiz.weightedScore,
    });
  }
}

export async function generateMentorAdvice(params: {
  profile: { skillLevel: string; primaryGoal: string; learningStyle: string };
  topCourse: string;
  weakTopic: string;
  quizAccuracy: number;
  prompt: string;
}): Promise<string> {
  const client = await getGeminiClient();
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!client) {
    return generateFallbackMentorResponse(params.prompt, params.profile.primaryGoal, params.weakTopic);
  }

  const systemContext = `You are an AI learning mentor for atomcamp.
Student Profile:
- Skill Level: ${params.profile.skillLevel}
- Primary Goal: ${params.profile.primaryGoal}
- Learning Style: ${params.profile.learningStyle}
- Top Recommended Course: ${params.topCourse}
- Weak Topic: ${params.weakTopic}
- Quiz Accuracy: ${params.quizAccuracy}%

Answer concisely and helpfully in 2-4 sentences. Be encouraging and specific.`;

  try {
    const response = await client.models.generateContent({
      model,
      contents: `${systemContext}\n\nStudent asks: ${params.prompt}`,
    });
    const text: string = response.text ?? "";
    return text || generateFallbackMentorResponse(params.prompt, params.profile.primaryGoal, params.weakTopic);
  } catch (err) {
    console.error("[gemini] generateMentorAdvice error:", err);
    return generateFallbackMentorResponse(params.prompt, params.profile.primaryGoal, params.weakTopic);
  }
}

function generateFallbackMentorResponse(prompt: string, goal: string, weakTopic: string): string {
  const promptLower = prompt.toLowerCase();

  if (promptLower.includes("weak topic") || promptLower.includes("weak")) {
    return `Your weak topic is ${weakTopic}. I recommend spending 30 minutes daily on targeted exercises in this area. Practice with real datasets and review core concepts through video tutorials before attempting advanced problems.`;
  }
  if (promptLower.includes("practice") || promptLower.includes("tasks")) {
    return `Here are 3 practice tasks: 1) Complete a hands-on lab in ${weakTopic}, 2) Build a mini-project applying your ${goal} skills, 3) Review and summarize key concepts from your last module. Consistent daily practice will accelerate your progress significantly.`;
  }
  if (promptLower.includes("study next") || promptLower.includes("next")) {
    return `Based on your current progress, focus next on strengthening ${weakTopic} before advancing. Once you achieve 75%+ accuracy in this area, you'll be ready to tackle the more advanced modules in your roadmap.`;
  }
  if (promptLower.includes("improve") || promptLower.includes("score")) {
    return `To improve your score, revisit ${weakTopic} materials and practice with varied difficulty levels. The adaptive quiz system will track your improvement — aim for consistent correct answers rather than rushing through questions.`;
  }
  return `Great question! Based on your goal of ${goal}, I recommend focusing on ${weakTopic} right now. Consistent practice with real-world examples is the fastest path to mastery. Keep pushing — you're making great progress!`;
}

export async function checkGeminiHealth(): Promise<boolean> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "demo_gemini_api_key_replace_with_real_value") return false;
  try {
    const client = await getGeminiClient();
    return client !== null;
  } catch {
    return false;
  }
}
