"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { revenueSeries } from "@/data/mock";
import { formatCompact, formatCurrency } from "@/lib/utils";

const tickStyle = { fill: "hsl(var(--muted-foreground))", fontSize: 11 };

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={revenueSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="rev-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6086ff" stopOpacity={0.5} />
            <stop offset="60%" stopColor="#8b5cf6" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#6086ff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="profit-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="hsl(var(--foreground) / 0.08)" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={tickStyle} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={tickStyle}
          tickFormatter={(v) => `$${formatCompact(v as number)}`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="glass-strong rounded-lg border-foreground/10 px-3 py-2 shadow-xl">
                <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
                {payload.map((p) => (
                  <div key={p.dataKey as string} className="flex items-center gap-2 text-xs">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-muted-foreground capitalize">{p.dataKey}</span>
                    <span className="font-semibold text-foreground ml-auto">
                      {formatCurrency(p.value as number)}
                    </span>
                  </div>
                ))}
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#6086ff"
          strokeWidth={2.5}
          fill="url(#rev-gradient)"
        />
        <Area
          type="monotone"
          dataKey="profit"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#profit-gradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
