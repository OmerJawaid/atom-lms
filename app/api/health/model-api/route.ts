import { NextResponse } from "next/server";
import { checkModelApiHealth } from "@/lib/services/model-api.service";
import { checkGeminiHealth } from "@/lib/services/gemini.service";
import { isSupabaseAvailable } from "@/lib/services/supabase.service";

export async function GET() {
  const [modelApi, gemini] = await Promise.all([
    checkModelApiHealth(),
    checkGeminiHealth(),
  ]);
  const supabase = isSupabaseAvailable();

  return NextResponse.json({
    modelApi: {
      connected: modelApi.connected,
      baseUrl: modelApi.baseUrl,
      endpoints: modelApi.endpoints,
      message: modelApi.message,
    },
    gemini: {
      connected: gemini,
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    },
    supabase: {
      connected: supabase,
    },
  });
}
