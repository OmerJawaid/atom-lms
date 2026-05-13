"use client";

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";

interface SkillProgressChartProps {
  skillLevel: string;
  confidenceScore: number;
  quizAccuracy: number;
  careerReadiness: number;
}

export function SkillProgressChart({ skillLevel, confidenceScore, quizAccuracy, careerReadiness }: SkillProgressChartProps) {
  const levelScore = skillLevel === "advanced" ? 85 : skillLevel === "intermediate" ? 60 : 35;

  const data = [
    { subject: "Confidence", value: confidenceScore },
    { subject: "Quiz Accuracy", value: quizAccuracy },
    { subject: "Career Ready", value: careerReadiness },
    { subject: "Skill Level", value: levelScore },
    { subject: "Engagement", value: Math.round((confidenceScore + quizAccuracy) / 2) },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Skill Overview</h3>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#6B7280" }} />
          <Radar dataKey="value" stroke="#008F11" fill="#008F11" fillOpacity={0.2} strokeWidth={2} />
          <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
