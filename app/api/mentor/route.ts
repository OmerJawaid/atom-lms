import { NextRequest, NextResponse } from "next/server";
import { generateMentorAdvice } from "@/lib/services/gemini.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, topCourse, weakTopic, quizAccuracy, prompt } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, message: "Prompt is required" }, { status: 400 });
    }

    const response = await generateMentorAdvice({
      profile: profile || { skillLevel: "beginner", primaryGoal: "data science", learningStyle: "hands-on" },
      topCourse: topCourse || "Data Science Bootcamp",
      weakTopic: weakTopic || "Core Concepts",
      quizAccuracy: quizAccuracy || 67,
      prompt,
    });

    return NextResponse.json({ success: true, response });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to generate mentor advice" },
      { status: 500 }
    );
  }
}
