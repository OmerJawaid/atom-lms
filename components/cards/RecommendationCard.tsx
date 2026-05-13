import { BookOpen, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface RecommendationCardProps {
  title: string;
  description: string;
  similarityScore: number;
  rank: number;
}

export function RecommendationCard({ title, description, similarityScore, rank }: RecommendationCardProps) {
  const isTop = rank === 1;

  return (
    <div className={cn(
      "bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow",
      isTop ? "border-[#008F11]/40 ring-1 ring-[#008F11]/20" : "border-gray-200"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            isTop ? "bg-[#008F11]/10" : "bg-gray-100"
          )}>
            <BookOpen className={cn("w-5 h-5", isTop ? "text-[#008F11]" : "text-gray-500")} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs font-bold px-2 py-0.5 rounded-full",
                isTop ? "bg-[#008F11] text-white" : "bg-gray-100 text-gray-600"
              )}>
                #{rank}
              </span>
              {isTop && (
                <span className="text-xs bg-[#B7FF4A]/30 text-[#4a7c00] px-2 py-0.5 rounded-full font-medium">
                  Top Match
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#008F11]">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-bold">{similarityScore}%</span>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Match Score</span>
          <span>{similarityScore}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#008F11] rounded-full transition-all"
            style={{ width: `${similarityScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}
