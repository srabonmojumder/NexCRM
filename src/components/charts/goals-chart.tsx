"use client";

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { goalProgress } from "@/data/mock";

export function GoalsChart() {
  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      {goalProgress.map((g) => (
        <div
          key={g.name}
          className="relative flex flex-col items-center justify-center rounded-xl bg-white/5 p-3"
        >
          <div className="h-20 w-20 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                data={[g]}
                startAngle={90}
                endAngle={90 - 360 * (g.value / 100)}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  dataKey="value"
                  cornerRadius={20}
                  fill={g.fill}
                  background={{ fill: "rgba(255,255,255,0.06)" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-display font-bold tabular-nums">{g.value}%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">{g.name}</p>
        </div>
      ))}
    </div>
  );
}
