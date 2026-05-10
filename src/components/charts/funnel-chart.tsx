"use client";

import { motion } from "framer-motion";

const stages = [
  { label: "Visitors", value: 24800, fill: "from-brand-500/80 to-brand-500/40" },
  { label: "Leads", value: 8200, fill: "from-violet-500/80 to-violet-500/40" },
  { label: "Qualified", value: 3140, fill: "from-pink-500/80 to-pink-500/40" },
  { label: "Proposals", value: 1280, fill: "from-amber-500/80 to-amber-500/40" },
  { label: "Customers", value: 412, fill: "from-emerald-500/80 to-emerald-500/40" },
];

const max = Math.max(...stages.map((s) => s.value));

export function FunnelChart() {
  return (
    <div className="space-y-3 py-2">
      {stages.map((s, i) => {
        const width = (s.value / max) * 100;
        const conv =
          i > 0 ? ((s.value / stages[i - 1].value) * 100).toFixed(1) : "—";
        return (
          <div key={s.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{s.label}</span>
              <span className="text-muted-foreground tabular-nums">
                {s.value.toLocaleString()}
                {i > 0 && (
                  <span className="ml-2 text-success font-mono">{conv}%</span>
                )}
              </span>
            </div>
            <div className="relative h-7 rounded-lg bg-white/[0.04] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r ${s.fill}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
