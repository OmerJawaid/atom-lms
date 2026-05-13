import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface InsightCardProps {
  title: string;
  content: string;
  icon?: LucideIcon;
  variant?: "default" | "warning" | "ai" | "success";
}

const variantStyles = {
  default: "bg-white border-gray-200",
  warning: "bg-yellow-50 border-yellow-200",
  ai: "bg-gradient-to-br from-[#008F11]/5 to-[#B7FF4A]/10 border-[#008F11]/20",
  success: "bg-green-50 border-green-200",
};

const iconStyles = {
  default: "bg-gray-100 text-gray-500",
  warning: "bg-yellow-100 text-yellow-600",
  ai: "bg-[#008F11]/10 text-[#008F11]",
  success: "bg-green-100 text-green-600",
};

export function InsightCard({ title, content, icon: Icon, variant = "default" }: InsightCardProps) {
  return (
    <div className={cn("rounded-xl border p-5 shadow-sm", variantStyles[variant])}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", iconStyles[variant])}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-1">{title}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
}
