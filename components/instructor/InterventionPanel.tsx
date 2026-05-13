"use client";

import { InterventionItem } from "@/lib/models/analytics.model";
import { AlertTriangle, Minus, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface InterventionPanelProps {
  interventions: InterventionItem[];
}

const priorityConfig = {
  urgent: { color: "border-red-200 bg-red-50", badge: "bg-red-100 text-red-700", icon: AlertTriangle, iconColor: "text-red-500" },
  moderate: { color: "border-yellow-200 bg-yellow-50", badge: "bg-yellow-100 text-yellow-700", icon: Minus, iconColor: "text-yellow-500" },
  low: { color: "border-green-200 bg-green-50", badge: "bg-green-100 text-green-700", icon: CheckCircle, iconColor: "text-green-500" },
};

export function InterventionPanel({ interventions }: InterventionPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="font-semibold text-gray-800 mb-1">Intervention Recommendations</h3>
      <p className="text-xs text-gray-400 mb-4">AI-generated actions for at-risk students</p>
      {interventions.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No interventions needed. All students are on track!</p>
      ) : (
        <div className="space-y-3">
          {interventions.map((item, i) => {
            const config = priorityConfig[item.priority];
            const Icon = config.icon;
            return (
              <div key={i} className={cn("rounded-xl border p-4", config.color)}>
                <div className="flex items-start gap-3">
                  <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", config.iconColor)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm text-gray-800">{item.studentName}</span>
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize", config.badge)}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.action}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
