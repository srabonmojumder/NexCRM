"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { salesAnalyticsSeries } from "@/data/mock";
import { formatCompact, formatCurrency } from "@/lib/utils";

const tickStyle = { fill: "hsl(var(--muted-foreground))", fontSize: 11 };

const series = [
  { key: "online", label: "Online Sales", color: "#f59e0b" },
  { key: "marketing", label: "Marketing Sales", color: "#10b981" },
] as const;

export function SalesAnalyticsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={salesAnalyticsSeries}
        margin={{ top: 8, right: 12, left: -8, bottom: 0 }}
      >
        <CartesianGrid
          stroke="hsl(var(--foreground) / 0.12)"
          strokeDasharray="4 4"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={tickStyle}
          tickMargin={10}
          tickFormatter={(v) => String(v).toUpperCase()}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={tickStyle}
          width={52}
          domain={[10000, 60000]}
          ticks={[10000, 20000, 30000, 40000, 50000, 60000]}
          tickFormatter={(v) => `$${formatCompact(v as number)}`}
        />
        <Tooltip
          cursor={{ stroke: "hsl(var(--foreground) / 0.2)", strokeWidth: 1 }}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="glass-strong rounded-lg border-foreground/10 px-3 py-2 shadow-xl">
                <p className="mb-1 text-xs font-semibold text-foreground">
                  {label}
                </p>
                {payload.map((p) => {
                  const meta = series.find((s) => s.key === p.dataKey);
                  return (
                    <div
                      key={p.dataKey as string}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="text-muted-foreground">
                        {meta?.label ?? (p.dataKey as string)}
                      </span>
                      <span className="ml-auto font-semibold text-foreground">
                        {formatCurrency(p.value as number)}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          }}
        />
        <Legend
          verticalAlign="top"
          align="right"
          height={34}
          content={() => (
            <ul className="flex items-center justify-end gap-4 pr-1">
              {series.map((s) => (
                <li
                  key={s.key}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.label}
                </li>
              ))}
            </ul>
          )}
        />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2.5}
            dot={{
              r: 3.5,
              fill: s.color,
              stroke: "hsl(var(--card))",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 5.5,
              fill: s.color,
              stroke: "hsl(var(--card))",
              strokeWidth: 2,
            }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
