"use client";

import { RoadmapWeek } from "@/lib/models/roadmap.model";
import { CheckCircle2, Circle, Zap, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface RoadmapTimelineProps {
  roadmap: RoadmapWeek[];
}

const statusConfig = {
  Completed: {
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
    border: "border-green-200",
    line: "bg-green-400",
  },
  "In Progress": {
    icon: Play,
    color: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200",
    line: "bg-blue-400",
  },
  "AI Recommended": {
    icon: Zap,
    color: "text-[#008F11]",
    bg: "bg-[#B7FF4A]/20",
    border: "border-[#008F11]/30",
    line: "bg-[#008F11]",
  },
  Upcoming: {
    icon: Circle,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    line: "bg-yellow-300",
  },
  Locked: {
    icon: Lock,
    color: "text-gray-400",
    bg: "bg-gray-50",
    border: "border-gray-200",
    line: "bg-gray-200",
  },
};

export function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
  return (
    <div className="space-y-4">
      {roadmap.map((item, index) => {
        const config = statusConfig[item.status] || statusConfig.Locked;
        const Icon = config.icon;
        const isLast = index === roadmap.length - 1;

        return (
          <div key={item.week} className="flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2", config.bg, config.border)}>
                <Icon className={cn("w-4 h-4", config.color)} />
              </div>
              {!isLast && <div className={cn("w-0.5 flex-1 mt-1", config.line, "min-h-[20px]")} />}
            </div>

            {/* Content */}
            <div className={cn(
              "flex-1 rounded-xl border p-4 mb-1 shadow-sm",
              config.bg, config.border,
              item.status === "AI Recommended" && "ring-1 ring-[#008F11]/30"
            )}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400 font-medium">Week {item.week}</span>
                    {item.status === "AI Recommended" && (
                      <span className="text-xs bg-[#B7FF4A]/40 text-[#4a7c00] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                        <Zap className="w-3 h-3" /> AI Pick
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900">{item.module}</h4>
                  <p className="text-sm text-gray-500 mt-1">{item.reason}</p>
                </div>
                <span className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full ml-3 flex-shrink-0",
                  config.bg, config.color,
                  "border", config.border
                )}>
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
