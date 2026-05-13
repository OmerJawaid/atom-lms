import { cn } from "@/lib/utils/cn";

interface ProgressCardProps {
  title: string;
  value: number;
  maxValue?: number;
  label?: string;
  color?: "green" | "yellow" | "red" | "blue";
}

const colorMap = {
  green: "bg-[#008F11]",
  yellow: "bg-yellow-400",
  red: "bg-red-500",
  blue: "bg-blue-500",
};

export function ProgressCard({ title, value, maxValue = 100, label, color = "green" }: ProgressCardProps) {
  const pct = Math.min(Math.round((value / maxValue) * 100), 100);
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <span className="text-lg font-bold text-gray-900">{value}{maxValue !== 100 ? `/${maxValue}` : "%"}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", colorMap[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {label && <p className="text-xs text-gray-400 mt-2">{label}</p>}
    </div>
  );
}
