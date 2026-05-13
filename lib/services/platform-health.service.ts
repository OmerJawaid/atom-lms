import { PlatformHealthStatus, ServiceHealth } from "@/lib/models/platform-health.model";

export async function checkSupabaseHealth(): Promise<ServiceHealth> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || url.includes("demo-project") || !key || key.includes("demo_")) {
    return { connected: false, service: "Supabase", mode: "demo", message: "No credentials configured — using fallback data" };
  }

  const start = Date.now();
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const client = createClient(url, key);
    const { error } = await client.from("students").select("count").limit(1);
    const latencyMs = Date.now() - start;
    if (error) return { connected: false, service: "Supabase", message: error.message, latencyMs };
    return { connected: true, service: "Supabase", mode: "live", latencyMs, details: { url: url.substring(0, 40) + "..." } };
  } catch (err) {
    return { connected: false, service: "Supabase", message: String(err), latencyMs: Date.now() - start };
  }
}

export async function checkGeminiHealth(): Promise<ServiceHealth> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey || apiKey.includes("demo_gemini")) {
    return { connected: false, service: "Google Gemini", mode: "fallback", message: "GEMINI_API_KEY not configured" };
  }

  try {
    const { GoogleGenAI } = await import("@google/genai");
    const genai = new GoogleGenAI({ apiKey });
    const start = Date.now();
    const res = await genai.models.generateContent({ model, contents: "Reply with one word: ok" });
    const latencyMs = Date.now() - start;
    const text = (res as unknown as { text?: string }).text ?? "";
    if (text) return { connected: true, service: "Google Gemini", mode: "live", latencyMs, details: { model } };
    return { connected: false, service: "Google Gemini", message: "Empty response", latencyMs };
  } catch (err) {
    return { connected: false, service: "Google Gemini", mode: "fallback", message: String(err) };
  }
}

export async function checkModelApiHealth(): Promise<ServiceHealth> {
  const baseUrl = process.env.MODEL_API_BASE_URL;
  if (!baseUrl) {
    return { connected: false, service: "External AtomCamp AI API", message: "MODEL_API_BASE_URL not configured" };
  }

  const start = Date.now();
  try {
    const res = await fetch(`${baseUrl}/`, {
      headers: { "ngrok-skip-browser-warning": "true" },
      signal: AbortSignal.timeout(6000),
    });
    const latencyMs = Date.now() - start;
    if (!res.ok) return { connected: false, service: "External AtomCamp AI API", message: `HTTP ${res.status}`, latencyMs };
    const data = await res.json().catch(() => ({}));
    return {
      connected: true, service: "External AtomCamp AI API", mode: "live", latencyMs,
      details: { baseUrl, status: data.status, endpoints: data.endpoints || ["/profile", "/recommend", "/quiz"] },
    };
  } catch (err) {
    return { connected: false, service: "External AtomCamp AI API", mode: "fallback", message: String(err), latencyMs: Date.now() - start };
  }
}

export async function getFullPlatformHealth(): Promise<PlatformHealthStatus> {
  const [supabase, gemini, modelApi] = await Promise.all([
    checkSupabaseHealth(),
    checkGeminiHealth(),
    checkModelApiHealth(),
  ]);

  const fallbackMode = !supabase.connected || !gemini.connected || !modelApi.connected;

  return {
    supabase, gemini, modelApi, fallbackMode,
    environment: process.env.NODE_ENV || "development",
    checkedAt: new Date().toISOString(),
  };
}
