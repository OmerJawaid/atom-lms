"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Loader2, Activity, RefreshCw, CheckCircle, XCircle, AlertCircle, Zap } from "lucide-react";
import { PlatformHealthStatus } from "@/lib/models/platform-health.model";

export default function AdminPlatformHealthPage() {
  const [health, setHealth] = useState<PlatformHealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load(refresh = false) {
    if (refresh) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/platform-health");
      const json = await res.json();
      if (json.success) setHealth(json.health);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#008F11]" />
        <p className="text-gray-500">Running health checks...</p>
      </div>
    </AppShell>
  );

  const services = health ? [
    { key: "supabase", data: health.supabase },
    { key: "gemini", data: health.gemini },
    { key: "modelApi", data: health.modelApi },
  ] : [];

  const allHealthy = services.every((s) => s.data.connected);
  const anyDown = services.some((s) => !s.data.connected);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-[#008F11]" />
              <h1 className="text-2xl font-bold text-gray-900">Platform Health</h1>
            </div>
            <p className="text-gray-500 text-sm">
              {health && `Checked ${new Date(health.checkedAt).toLocaleString()} • ${health.environment}`}
            </p>
          </div>
          <button onClick={() => load(true)} disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Re-check
          </button>
        </div>

        {health && (
          <>
            <div className={`rounded-xl p-4 flex items-center gap-3 ${allHealthy ? "bg-green-50 border border-green-200" : anyDown ? "bg-red-50 border border-red-200" : "bg-yellow-50 border border-yellow-200"}`}>
              {allHealthy ? <CheckCircle className="w-5 h-5 text-green-600" /> : anyDown ? <XCircle className="w-5 h-5 text-red-600" /> : <AlertCircle className="w-5 h-5 text-yellow-600" />}
              <div>
                <p className={`font-semibold ${allHealthy ? "text-green-800" : anyDown ? "text-red-800" : "text-yellow-800"}`}>
                  {allHealthy ? "All systems operational" : health.fallbackMode ? "Running in fallback mode — some services unavailable" : "Degraded — some services have issues"}
                </p>
                <p className={`text-sm ${allHealthy ? "text-green-700" : anyDown ? "text-red-700" : "text-yellow-700"}`}>
                  {services.filter((s) => s.data.connected).length}/{services.length} services connected
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map(({ key, data }) => (
                <div key={key} className={`bg-white rounded-xl border ${data.connected ? "border-green-200" : "border-red-200"} p-5 shadow-sm`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className={`w-4 h-4 ${data.connected ? "text-[#008F11]" : "text-red-500"}`} />
                      <h3 className="font-semibold text-gray-800">{data.service}</h3>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${data.connected ? "bg-green-500" : "bg-red-500"}`} />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className={`font-medium ${data.connected ? "text-green-700" : "text-red-700"}`}>{data.connected ? "Connected" : "Disconnected"}</span>
                    </div>
                    {data.mode && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Mode</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${data.mode === "live" ? "bg-green-100 text-green-700" : data.mode === "demo" || data.mode === "fallback" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>{data.mode}</span>
                      </div>
                    )}
                    {data.latencyMs !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Latency</span>
                        <span className={`font-medium ${data.latencyMs < 500 ? "text-green-700" : data.latencyMs < 2000 ? "text-yellow-700" : "text-red-700"}`}>{data.latencyMs}ms</span>
                      </div>
                    )}
                    {data.message && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 break-words">{data.message}</p>
                      </div>
                    )}
                    {data.details && (
                      <div className="pt-2 border-t border-gray-100">
                        {Object.entries(data.details).map(([k, v]) => (
                          <p key={k} className="text-xs text-gray-500 break-words"><span className="font-medium">{k}:</span> {String(v)}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Fallback Behavior</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="font-bold text-gray-800 flex-shrink-0">Supabase down:</span>
                  <span>All data falls back to demo TypeScript datasets. Writes silently no-op. No data loss.</span>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="font-bold text-gray-800 flex-shrink-0">Gemini down:</span>
                  <span>AI insights use static template responses. Reports and quiz feedback use pre-defined fallbacks.</span>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="font-bold text-gray-800 flex-shrink-0">AtomCamp API down:</span>
                  <span>Learner profiling and recommendations use local fallback scoring. Quiz adaptive difficulty defaults to medium.</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
