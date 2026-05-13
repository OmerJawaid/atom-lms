"use client";

import { AtRiskStudent } from "@/lib/models/analytics.model";
import { cn } from "@/lib/utils/cn";
import { AlertTriangle, CheckCircle, Minus } from "lucide-react";

interface AtRiskStudentsTableProps {
  students: AtRiskStudent[];
}

const riskConfig = {
  High: { color: "text-red-700 bg-red-100 border-red-200", icon: AlertTriangle, dot: "bg-red-500" },
  Medium: { color: "text-yellow-700 bg-yellow-100 border-yellow-200", icon: Minus, dot: "bg-yellow-500" },
  Low: { color: "text-green-700 bg-green-100 border-green-200", icon: CheckCircle, dot: "bg-green-500" },
};

export function AtRiskStudentsTable({ students }: AtRiskStudentsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Student Risk Assessment</h3>
        <p className="text-xs text-gray-400 mt-0.5">{students.length} students enrolled</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Goal</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Confidence</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Weak Topic</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {students.map((s) => {
              const config = riskConfig[s.riskLevel];
              return (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#0B1F33] flex items-center justify-center text-white text-xs font-bold">
                        {s.name[0]}
                      </div>
                      <span className="font-medium text-gray-800">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                      s.skillLevel === "advanced" ? "bg-purple-100 text-purple-700" :
                      s.skillLevel === "intermediate" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    )}>
                      {s.skillLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate" title={s.primaryGoal}>
                    {s.primaryGoal}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", s.confidenceScore >= 70 ? "bg-green-500" : s.confidenceScore >= 55 ? "bg-yellow-500" : "bg-red-500")}
                          style={{ width: `${s.confidenceScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{s.confidenceScore}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-[140px]" title={s.weakTopic}>
                    {s.weakTopic}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border", config.color)}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
                      {s.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px]">
                    <span className="line-clamp-2">{s.recommendedAction}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
