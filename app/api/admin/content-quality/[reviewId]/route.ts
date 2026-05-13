import { NextRequest, NextResponse } from "next/server";
import { updateContentQualityStatus } from "@/lib/services/admin.service";
import { ContentQualityReview } from "@/lib/models/content-quality.model";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ reviewId: string }> }) {
  const { reviewId } = await params;
  try {
    const { status } = await req.json() as { status: ContentQualityReview["status"] };
    if (!["open", "reviewing", "fixed"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }
    await updateContentQualityStatus(reviewId, status);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update status" }, { status: 500 });
  }
}
