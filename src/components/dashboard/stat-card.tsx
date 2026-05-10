"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import { useCountUp } from "@/hooks/use-counter";
import { Card } from "@/components/ui/card";
import {
  cn,
  formatCompact,
  formatCurrency,
  formatNumber,
  formatPercent,
} from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  delta: number;
  format: "currency" | "number" | "percent";
  series: number[];
  icon?: LucideIcon;
  accent?: "primary" | "success" | "warning" | "info";
  delay?: number;
}

const accentMap = {
  primary: { gradient: "from-brand-500 to-violet-500", stroke: "#6086ff", fill: "url(#g-primary)" },
  success: { gradient: "from-emerald-400 to-teal-500", stroke: "#10b981", fill: "url(#g-success)" },
  warning: { gradient: "from-amber-400 to-orange-500", stroke: "#f59e0b", fill: "url(#g-warning)" },
  info: { gradient: "from-sky-400 to-cyan-500", stroke: "#0ea5e9", fill: "url(#g-info)" },
} as const;

export function StatCard({
  label,
  value,
  delta,
  format,
  series,
  icon: Icon,
  accent = "primary",
  delay = 0,
}: StatCardProps) {
  const animated = useCountUp(value);
  const positive = delta >= 0;
  const a = accentMap[accent];

  const display =
    format === "currency"
      ? formatCurrency(animated)
      : format === "percent"
        ? `${animated.toFixed(1)}%`
        : value > 9999
          ? formatCompact(animated)
          : formatNumber(Math.round(animated));

  const data = series.map((v, i) => ({ i, v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        variant="glass"
        className="relative overflow-hidden p-5 card-hover group"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="font-display text-2xl font-bold tracking-tight mt-2">
              {display}
            </p>
          </div>
          {Icon && (
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
                a.gradient
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>

        <div className="flex items-end justify-between mt-4">
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              positive
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {formatPercent(delta)}
          </div>

          <div className="h-10 w-24 -mr-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-primary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6086ff" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6086ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-success" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-warning" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-info" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={a.stroke}
                  strokeWidth={2}
                  fill={a.fill}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className={cn(
            "absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
            "bg-gradient-to-br",
            a.gradient,
            "blur-2xl -z-10"
          )}
          style={{ opacity: 0.08 }}
        />
      </Card>
    </motion.div>
  );
}
