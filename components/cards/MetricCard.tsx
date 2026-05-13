import { cn } from "@/lib/utils/cn";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger" | "primary";
}

const toneStyles = {
  default: "bg-white border-gray-200",
  success: "bg-green-50 border-green-200",
  warning: "bg-yellow-50 border-yellow-200",
  danger: "bg-red-50 border-red-200",
  primary: "bg-[#008F11]/5 border-[#008F11]/20",
};

const iconStyles = {
  default: "bg-gray-100 text-gray-600",
  success: "bg-green-100 text-green-600",
  warning: "bg-yellow-100 text-yellow-600",
  danger: "bg-red-100 text-red-600",
  primary: "bg-[#008F11]/10 text-[#008F11]",
};

export function MetricCard({ title, value, subtitle, icon: Icon, tone = "default" }: MetricCardProps) {
  return (
    <div className={cn("rounded-xl border p-5 shadow-sm", toneStyles[tone])}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center ml-3", iconStyles[tone])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
