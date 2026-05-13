"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

interface CoursePerformanceChartProps {
  data: Array<{ course: string; count: number; avgScore: number }>;
}

const COLORS = ["#008F11", "#006B0D", "#16A34A", "#4ade80", "#86efac"];

export function CoursePerformanceChart({ data }: CoursePerformanceChartProps) {
  const chartData = data.map((d) => ({
    name: d.course.length > 15 ? d.course.slice(0, 15) + "…" : d.course,
    fullName: d.course,
    Learners: d.count,
    "Avg Score": d.avgScore,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Course Performance</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} />
          <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
          <Tooltip
            formatter={(value, name) => [value, name]}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="Learners" radius={[4, 4, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
