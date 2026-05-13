import { NextRequest, NextResponse } from "next/server";
import { getAdminSettings, updateAdminSettings } from "@/lib/services/admin.service";

export async function GET() {
  try {
    const settings = await getAdminSettings();
    return NextResponse.json({ success: true, settings });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    await updateAdminSettings(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
