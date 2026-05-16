"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { trafficSources } from "@/data/mock";

export function TrafficChart() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center h-full">
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={trafficSources}
              dataKey="value"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              cornerRadius={6}
              startAngle={90}
              endAngle={-270}
            >
              {trafficSources.map((s) => (
                <Cell key={s.name} fill={s.fill} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0];
                return (
                  <div className="glass-strong rounded-lg border-foreground/10 px-3 py-2 shadow-xl">
                    <p className="text-xs font-semibold">{p.payload.name}</p>
                    <p className="text-xs text-muted-foreground">{p.value}%</p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-2.5 sm:min-w-[140px]">
        {trafficSources.map((s) => (
          <li key={s.name} className="flex items-center gap-3 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: s.fill }}
            />
            <span className="text-muted-foreground flex-1">{s.name}</span>
            <span className="font-semibold tabular-nums">{s.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
