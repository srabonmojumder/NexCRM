"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { events } from "@/data/mock";
import { cn } from "@/lib/utils";

const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

function buildMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];
  for (let i = 0; i < first.getDay(); i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

export function CalendarWidget({
  selected,
  onSelect,
}: {
  selected?: Date;
  onSelect?: (d: Date) => void;
}) {
  const [cursor, setCursor] = useState(() => {
    const base = selected ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const today = new Date();
  const days = useMemo(() => buildMonth(cursor), [cursor]);
  const monthLabel = cursor.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const eventDates = useMemo(() => {
    return new Set(
      events.map((e) => {
        const d = new Date(e.start);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
    );
  }, []);

  const isSameDay = (a: Date, b?: Date) =>
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-display font-semibold">{monthLabel}</p>
        <div className="flex items-center gap-1">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {dayNames.map((d, i) => (
          <div
            key={`${d}-${i}`}
            className="text-center text-[10px] uppercase tracking-widest font-semibold text-muted-foreground py-1"
          >
            {d}
          </div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div key={i} />;
          const isToday = isSameDay(d, today);
          const isSelected = isSameDay(d, selected);
          const has = eventDates.has(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelect?.(d)}
              className={cn(
                "relative aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all",
                isSelected
                  ? "bg-brand-gradient text-white shadow-lg shadow-primary/30"
                  : isToday
                    ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                    : "text-foreground hover:bg-foreground/5"
              )}
            >
              {d.getDate()}
              {has && !isSelected && (
                <span className={cn("absolute bottom-1 h-1 w-1 rounded-full", isToday ? "bg-primary" : "bg-primary/60")} />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
