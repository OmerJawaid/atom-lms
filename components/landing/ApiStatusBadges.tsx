"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff, Database, Brain, Zap } from "lucide-react";

interface HealthData {
  modelApi: { connected: boolean; baseUrl?: string; message?: string };
  gemini: { connected: boolean; model?: string };
  supabase: { connected: boolean };
}

export function ApiStatusBadges() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/health/model-api")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => {
        setHealth({
          modelApi: { connected: false, message: "Unreachable" },
          gemini: { connected: false },
          supabase: { connected: false },
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        {["Model API", "Gemini AI", "Supabase"].map((name) => (
          <div key={name} className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-xs text-gray-300">{name}</span>
          </div>
        ))}
      </div>
    );
  }

  const badges = [
    {
      label: health?.modelApi.connected ? "Model API Connected" : "Model API Fallback",
      connected: health?.modelApi.connected ?? false,
      icon: Zap,
      detail: health?.modelApi.connected ? "/profile /recommend /quiz" : "Using demo data",
    },
    {
      label: health?.gemini.connected ? "Gemini Connected" : "Gemini Fallback",
      connected: health?.gemini.connected ?? false,
      icon: Brain,
      detail: health?.gemini.connected ? health?.gemini.model || "gemini-2.5-flash" : "Using fallback roadmap",
    },
    {
      label: health?.supabase.connected ? "Supabase Connected" : "Demo Data Mode",
      connected: health?.supabase.connected ?? false,
      icon: Database,
      detail: health?.supabase.connected ? "Live database" : "Local demo data",
    },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs text-gray-400 mr-1">API Status:</span>
      {badges.map((b) => {
        const Icon = b.icon;
        const WifiIcon = b.connected ? Wifi : WifiOff;
        return (
          <div
            key={b.label}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 border text-xs font-medium ${
              b.connected
                ? "bg-green-500/10 border-green-500/30 text-green-300"
                : "bg-yellow-500/10 border-yellow-500/30 text-yellow-300"
            }`}
          >
            <WifiIcon className="w-3 h-3" />
            <Icon className="w-3 h-3" />
            <span>{b.label}</span>
          </div>
        );
      })}
    </div>
  );
}
