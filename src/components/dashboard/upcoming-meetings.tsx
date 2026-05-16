"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { events } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { EventType } from "@/types";

const colorMap: Record<EventType, { dot: string; bg: string }> = {
  meeting: { dot: "bg-primary", bg: "from-primary/15 to-violet-500/15" },
  call: { dot: "bg-info", bg: "from-info/15 to-sky-500/15" },
  demo: { dot: "bg-warning", bg: "from-warning/15 to-orange-500/15" },
  "follow-up": { dot: "bg-success", bg: "from-success/15 to-emerald-500/15" },
  internal: { dot: "bg-muted-foreground", bg: "from-foreground/10 to-foreground/5" },
};

export function UpcomingMeetings({ limit = 4 }: { limit?: number }) {
  const visible = events.slice(0, limit);

  return (
    <ul className="space-y-2">
      {visible.map((evt, idx) => {
        const c = colorMap[evt.type];
        const start = new Date(evt.start);
        const end = new Date(evt.end);
        return (
          <motion.li
            key={evt.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={cn(
              "relative flex gap-3 rounded-xl border border-foreground/5 bg-gradient-to-br p-3 transition-all hover:border-foreground/10",
              c.bg
            )}
          >
            <div className="flex flex-col items-center justify-center bg-foreground/5 rounded-lg px-2.5 py-1.5 text-center min-w-[52px]">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                {start.toLocaleDateString("en-US", { month: "short" })}
              </span>
              <span className="font-display text-xl font-bold leading-none">
                {start.getDate()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
                <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                  {evt.type}
                </span>
              </div>
              <p className="text-sm font-semibold truncate">{evt.title}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  {" - "}
                  {end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                </span>
                {evt.location && (
                  <span className="inline-flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3" />
                    {evt.location}
                  </span>
                )}
              </div>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
