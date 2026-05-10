"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { week: "W1", visit: 2.4, lead: 1.8, paid: 0.9 },
  { week: "W2", visit: 2.6, lead: 2.0, paid: 1.0 },
  { week: "W3", visit: 3.0, lead: 2.2, paid: 1.2 },
  { week: "W4", visit: 2.9, lead: 2.4, paid: 1.4 },
  { week: "W5", visit: 3.4, lead: 2.6, paid: 1.5 },
  { week: "W6", visit: 3.8, lead: 2.9, paid: 1.7 },
  { week: "W7", visit: 4.0, lead: 3.1, paid: 1.9 },
  { week: "W8", visit: 4.3, lead: 3.4, paid: 2.1 },
];

const tickStyle = { fill: "rgba(255,255,255,0.5)", fontSize: 11 };

export function ConversionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={tickStyle} />
        <YAxis axisLine={false} tickLine={false} tick={tickStyle} tickFormatter={(v) => `${v}%`} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="glass-strong rounded-lg border-white/10 px-3 py-2 shadow-xl">
                <p className="text-xs font-semibold mb-1">{label}</p>
                {payload.map((p) => (
                  <div key={p.dataKey as string} className="flex items-center gap-2 text-xs">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-muted-foreground capitalize">{p.dataKey}</span>
                    <span className="font-semibold ml-auto">{p.value}%</span>
                  </div>
                ))}
              </div>
            );
          }}
        />
        <Line type="monotone" dataKey="visit" stroke="#6086ff" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="lead" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="paid" stroke="#10b981" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
