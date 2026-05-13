import { NextRequest, NextResponse } from "next/server";
import { handleOnboarding } from "@/lib/controllers/onboarding.controller";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await handleOnboarding({
      name: body.name,
      email: body.email,
      text: body.text,
      quizHistory: body.quizHistory,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { success: false, message, fallbackUsed: true, data: {} },
      { status: 500 }
    );
  }
}
