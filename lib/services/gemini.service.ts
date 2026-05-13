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

export async function generateQuizFeedback(params: {
  quizTitle: string;
  score: number;
  accuracy: number;
  weakTopics: string[];
  nextDifficulty: string;
  answers: Array<{ questionText: string; isCorrect: boolean; difficulty: string; topic?: string }>;
}): Promise<string> {
  const client = await getGeminiClient();
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!client) return generateFallbackQuizFeedback(params);

  const wrongAnswers = params.answers.filter((a) => !a.isCorrect);
  const prompt = `You are an expert instructor for atomcamp. A student just completed a quiz.

Quiz: "${params.quizTitle}"
Score: ${params.score}% (${params.accuracy}% accuracy)
Next Difficulty Level: ${params.nextDifficulty}
Weak Topics: ${params.weakTopics.join(", ") || "none identified"}

Wrong Answers (${wrongAnswers.length}):
${wrongAnswers.map((a, i) => `${i + 1}. [${a.difficulty}] ${a.questionText} (Topic: ${a.topic || "general"})`).join("\n")}

Write a personalized, encouraging feedback paragraph (3-4 sentences) that:
1. Acknowledges their performance
2. Identifies the key gap areas
3. Recommends specific next steps
4. Motivates continued learning

Be specific, warm, and actionable. Do not use bullet points — write in flowing prose.`;

  try {
    const response = await client.models.generateContent({ model, contents: prompt });
    const text: string = response.text ?? "";
    return text || generateFallbackQuizFeedback(params);
  } catch (err) {
    console.error("[gemini] generateQuizFeedback error:", err);
    return generateFallbackQuizFeedback(params);
  }
}

function generateFallbackQuizFeedback(params: { score: number; accuracy: number; weakTopics: string[]; nextDifficulty: string; quizTitle: string }): string {
  if (params.accuracy >= 80) {
    return `Excellent work on the ${params.quizTitle}! Your ${params.accuracy}% accuracy shows strong command of the material. You're ready for ${params.nextDifficulty}-difficulty challenges — keep this momentum going as you progress to the next module.`;
  }
  if (params.accuracy >= 60) {
    const weak = params.weakTopics.length ? params.weakTopics.slice(0, 2).join(" and ") : "some core areas";
    return `Good effort on the ${params.quizTitle}! With ${params.accuracy}% accuracy, you have a solid foundation but could strengthen ${weak}. Review those concepts and practice with examples before moving on — you're very close to mastery.`;
  }
  const weak = params.weakTopics.length ? params.weakTopics.slice(0, 2).join(" and ") : "the fundamental concepts";
  return `You scored ${params.accuracy}% on the ${params.quizTitle} — this is a learning opportunity! Focus on revisiting ${weak}, which appeared in several of the questions you found challenging. Consider re-watching the lecture and taking notes before retrying the quiz.`;
}

export async function generateQuizQuestions(params: {
  lectureTitle: string;
  lectureContent: string;
  count?: number;
  difficulty?: string;
}): Promise<Array<{ questionText: string; options: Array<{label: string; value: string}>; correctAnswer: string; explanation: string; difficulty: string; topic: string }>> {
  const client = await getGeminiClient();
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const count = params.count || 5;
  const difficulty = params.difficulty || "medium";

  if (!client) return generateFallbackQuestions(params.lectureTitle, count);

  const contentSnippet = params.lectureContent.substring(0, 2000);

  const prompt = `You are an expert quiz designer for atomcamp. Generate ${count} multiple-choice questions for the lecture below.

Lecture Title: "${params.lectureTitle}"
Lecture Content Excerpt:
${contentSnippet}

Requirements:
- Difficulty: ${difficulty} (mix in some easy and hard if appropriate)
- Each question must have exactly 4 options labeled A, B, C, D
- Test conceptual understanding, not just memorization
- Include practical/applied questions

Return ONLY valid JSON array (no markdown) with this exact structure:
[
  {
    "questionText": "string",
    "options": [{"label": "A", "value": "answer text"}, {"label": "B", "value": "..."}, {"label": "C", "value": "..."}, {"label": "D", "value": "..."}],
    "correctAnswer": "exact value of correct option",
    "explanation": "why this is correct (1-2 sentences)",
    "difficulty": "easy|medium|hard",
    "topic": "specific topic within the lecture"
  }
]`;

  try {
    const response = await client.models.generateContent({ model, contents: prompt, config: { responseMimeType: "application/json" } });
    const text: string = response.text ?? "";
    if (!text) throw new Error("Empty response");
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("Not array");
    return parsed.slice(0, count);
  } catch (err) {
    console.error("[gemini] generateQuizQuestions error:", err);
    return generateFallbackQuestions(params.lectureTitle, count);
  }
}

function generateFallbackQuestions(lectureTitle: string, count: number) {
  const templates = [
    { questionText: `What is the primary purpose of ${lectureTitle}?`, options: [{label:"A",value:"Data storage"},{label:"B",value:"Data analysis and insight generation"},{label:"C",value:"Network management"},{label:"D",value:"User authentication"}], correctAnswer: "Data analysis and insight generation", explanation: "The primary purpose is analysis and insight generation.", difficulty: "easy", topic: lectureTitle },
    { questionText: `Which approach is considered best practice in ${lectureTitle}?`, options: [{label:"A",value:"Trial and error only"},{label:"B",value:"Following systematic methodology"},{label:"C",value:"Using a single tool"},{label:"D",value:"Skipping documentation"}], correctAnswer: "Following systematic methodology", explanation: "Systematic methodology ensures reliable and reproducible results.", difficulty: "medium", topic: lectureTitle },
    { questionText: `A key challenge when applying ${lectureTitle} concepts is:`, options: [{label:"A",value:"Data quality and completeness"},{label:"B",value:"Hardware limitations only"},{label:"C",value:"Programming language choice"},{label:"D",value:"Team size"}], correctAnswer: "Data quality and completeness", explanation: "Data quality issues are the most common challenge in applied analytics.", difficulty: "medium", topic: lectureTitle },
    { questionText: `What metric is most important to monitor in ${lectureTitle}?`, options: [{label:"A",value:"Raw data volume"},{label:"B",value:"Performance accuracy relative to business goals"},{label:"C",value:"Processing speed only"},{label:"D",value:"Number of features"}], correctAnswer: "Performance accuracy relative to business goals", explanation: "Business-aligned metrics determine the true success of any analytical approach.", difficulty: "hard", topic: lectureTitle },
    { questionText: `The iterative nature of ${lectureTitle} means:`, options: [{label:"A",value:"You only analyze data once"},{label:"B",value:"Results improve as you refine hypotheses and collect more data"},{label:"C",value:"Each iteration makes things more complex"},{label:"D",value:"Automation replaces all manual work"}], correctAnswer: "Results improve as you refine hypotheses and collect more data", explanation: "Iterative processes lead to continuously improving insights.", difficulty: "medium", topic: lectureTitle },
  ];
  return templates.slice(0, count);
}

export async function generateAdminInsights(input: {
  totalLearners: number;
  averageCompletion: number;
  averageQuizScore: number;
  highRiskLearners: number;
  mostRecommendedProgram: string;
  mostDifficultTopic: string;
  cohortPerformance: Array<{ name: string; averageCompletion: number; riskCount: number }>;
  contentQualityIssues: Array<{ courseName?: string; issueType: string; qualityScore: number }>;
}): Promise<{ summary: string; insights: Array<{ title: string; severity: "high" | "medium" | "low"; evidence: string; recommendedAction: string; expectedImpact: string }>; generatedAt: string; modelUsed: "gemini" | "fallback" }> {
  const client = await getGeminiClient();
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const fallback = {
    summary: `Platform has ${input.totalLearners} learners with ${input.averageCompletion}% avg completion and ${input.averageQuizScore}% avg quiz score. ${input.highRiskLearners} learners are at high risk. ${input.mostDifficultTopic} is the primary weak topic requiring immediate remediation.`,
    insights: [
      { title: `${input.mostDifficultTopic} needs remediation`, severity: "high" as const, evidence: `${input.mostDifficultTopic} appears most frequently in failed quiz answers across multiple cohorts.`, recommendedAction: `Add a dedicated remedial lecture and 5 adaptive practice questions for ${input.mostDifficultTopic}.`, expectedImpact: "Reduces quiz failure rate by ~15% and decreases instructor intervention load." },
      { title: `${input.highRiskLearners} high-risk learners need intervention`, severity: "high" as const, evidence: `${input.highRiskLearners} learners score below 50% on quizzes or have career readiness below 55.`, recommendedAction: "Send personalized study plans and schedule 1:1 sessions for all high-risk learners.", expectedImpact: "Expected to recover 40-60% of at-risk learners within 2 weeks." },
      { title: `${input.mostRecommendedProgram} should receive content investment`, severity: "medium" as const, evidence: `${input.mostRecommendedProgram} is the most recommended program but has significant quality improvement opportunities.`, recommendedAction: "Prioritize content updates, add 2-3 new practical exercises, and attach quizzes to all lectures.", expectedImpact: "Increases completion rate by 10-15% and improves learner satisfaction." },
      { title: "Content quality issues detected in multiple programs", severity: "medium" as const, evidence: `${input.contentQualityIssues.length} content quality issues identified, including high failure rates and low completion.`, recommendedAction: "Resolve all critical quality issues within 2 weeks. Start with SQL Foundations and Power BI Fundamentals.", expectedImpact: "Improves overall platform quality score and reduces dropout rates." },
    ],
    generatedAt: new Date().toISOString(),
    modelUsed: "fallback" as const,
  };

  if (!client) return fallback;

  const prompt = `You are an AI analytics advisor for atomcamp, an EdTech platform.

Platform data:
- Total learners: ${input.totalLearners}
- Average completion: ${input.averageCompletion}%
- Average quiz score: ${input.averageQuizScore}%
- High-risk learners: ${input.highRiskLearners}
- Most recommended program: ${input.mostRecommendedProgram}
- Most difficult topic: ${input.mostDifficultTopic}
- Active cohorts: ${input.cohortPerformance.length}
- Content issues: ${input.contentQualityIssues.length}

Generate a platform intelligence briefing. Return ONLY valid JSON (no markdown):
{
  "summary": "2-3 sentence executive summary",
  "insights": [
    {
      "title": "string",
      "severity": "high|medium|low",
      "evidence": "specific data-backed evidence",
      "recommendedAction": "concrete next step",
      "expectedImpact": "measurable outcome"
    }
  ]
}
Generate exactly 4 insights. Be specific and data-driven.`;

  try {
    const response = await client.models.generateContent({ model, contents: prompt, config: { responseMimeType: "application/json" } });
    const text: string = (response as unknown as { text?: string }).text ?? "";
    if (!text) throw new Error("Empty response");
    const parsed = JSON.parse(text);
    return { ...parsed, generatedAt: new Date().toISOString(), modelUsed: "gemini" as const };
  } catch (err) {
    console.error("[gemini] generateAdminInsights error:", err);
    return fallback;
  }
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
