"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { channelPerformance } from "@/data/mock";

const tickStyle = { fill: "hsl(var(--muted-foreground))", fontSize: 11 };

export function ChannelChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={channelPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
            <stop offset="100%" stopColor="#6086ff" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="hsl(var(--foreground) / 0.08)" vertical={false} />
        <XAxis dataKey="channel" axisLine={false} tickLine={false} tick={tickStyle} />
        <YAxis axisLine={false} tickLine={false} tick={tickStyle} />
        <Tooltip
          cursor={{ fill: "hsl(var(--foreground) / 0.06)" }}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="glass-strong rounded-lg border-foreground/10 px-3 py-2 shadow-xl">
                <p className="text-xs font-semibold mb-0.5">{label}</p>
                <p className="text-xs text-muted-foreground">
                  Deals: <span className="text-foreground font-semibold">{payload[0].value}</span>
                </p>
              </div>
            );
          }}
        />
        <Bar dataKey="deals" fill="url(#bar-gradient)" radius={[8, 8, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}
