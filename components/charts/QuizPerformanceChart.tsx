"use client";

import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, Legend
} from "recharts";

interface QuizPerformanceChartProps {
  accuracy: number;
  weightedScore: number;
}

export function QuizPerformanceChart({ accuracy, weightedScore }: QuizPerformanceChartProps) {
  const data = [
    { name: "Accuracy", value: accuracy, fill: "#008F11" },
    { name: "Weighted Score", value: weightedScore, fill: "#B7FF4A" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Quiz Performance</h3>
      <ResponsiveContainer width="100%" height={200}>
        <RadialBarChart innerRadius="40%" outerRadius="80%" data={data} startAngle={90} endAngle={-270}>
          <RadialBar dataKey="value" cornerRadius={5} background={{ fill: "#f3f4f6" }} />
          <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
