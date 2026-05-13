import { cn } from "@/lib/utils/cn";

interface StatusBadgeProps {
  label: string;
  status: "success" | "warning" | "danger" | "neutral" | "ai";
}

const styles = {
  success: "bg-green-100 text-green-700 border-green-200",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
  danger: "bg-red-100 text-red-700 border-red-200",
  neutral: "bg-gray-100 text-gray-600 border-gray-200",
  ai: "bg-[#B7FF4A]/20 text-[#4a7c00] border-[#B7FF4A]/40",
};

export function StatusBadge({ label, status }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status])}>
      {status === "ai" && <span className="w-1.5 h-1.5 rounded-full bg-[#008F11] mr-1.5" />}
      {label}
    </span>
  );
}
