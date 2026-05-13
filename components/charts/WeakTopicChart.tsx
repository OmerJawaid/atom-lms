"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { WeakTopicItem } from "@/lib/models/analytics.model";

interface WeakTopicChartProps {
  data: WeakTopicItem[];
}

const severityColors = {
  high: "#DC2626",
  medium: "#F59E0B",
  low: "#16A34A",
};

export function WeakTopicChart({ data }: WeakTopicChartProps) {
  const chartData = data.map((d) => ({
    topic: d.topic.length > 18 ? d.topic.slice(0, 18) + "…" : d.topic,
    fullTopic: d.topic,
    count: d.count,
    severity: d.severity,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-1">Weak Topics Heatmap</h3>
      <p className="text-xs text-gray-400 mb-4">Number of students struggling per topic</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} />
          <YAxis type="category" dataKey="topic" tick={{ fontSize: 11, fill: "#6B7280" }} width={60} />
          <Tooltip
            formatter={(v, _n, props) => [v + " students", props.payload.fullTopic]}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={severityColors[entry.severity]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2">
        {Object.entries(severityColors).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-500 capitalize">{key} risk</span>
          </div>
        ))}
      </div>
    </div>
  );
}
