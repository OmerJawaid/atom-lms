import { NextRequest, NextResponse } from "next/server";
import { handleRecommendationRequest } from "@/lib/controllers/recommendation.controller";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await handleRecommendationRequest(body.text || "");
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error", fallbackUsed: true },
      { status: 500 }
    );
  }
}
