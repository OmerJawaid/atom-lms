export interface ServiceHealth {
  connected: boolean;
  service: string;
  mode?: string;
  message?: string;
  latencyMs?: number;
  lastChecked?: string;
  details?: Record<string, unknown>;
}

export interface PlatformHealthStatus {
  supabase: ServiceHealth;
  gemini: ServiceHealth;
  modelApi: ServiceHealth;
  fallbackMode: boolean;
  environment: string;
  checkedAt: string;
}
