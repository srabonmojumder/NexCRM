"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarWidget } from "@/components/calendar/calendar-widget";
import { PageHeader } from "@/components/common/page-header";
import { events } from "@/data/mock";
import { cn, getInitials } from "@/lib/utils";
import type { EventType } from "@/types";

const typeMap: Record<EventType, { tone: string; bg: string; border: string }> = {
  meeting: { tone: "text-primary", bg: "bg-primary/10", border: "border-l-primary" },
  call: { tone: "text-info", bg: "bg-info/10", border: "border-l-info" },
  demo: { tone: "text-warning", bg: "bg-warning/10", border: "border-l-warning" },
  "follow-up": { tone: "text-success", bg: "bg-success/10", border: "border-l-success" },
  internal: { tone: "text-muted-foreground", bg: "bg-foreground/5", border: "border-l-foreground/30" },
};

const hours = Array.from({ length: 12 }, (_, i) => 8 + i);
const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfWeek(d: Date) {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  date.setDate(date.getDate() - date.getDay());
  return date;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CalendarPage() {
  const [selected, setSelected] = useState<Date>(() => new Date());

  const today = new Date();
  const weekStart = startOfWeek(selected);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return { date: d, label: dayLabels[i] };
  });
  const weekEnd = weekDays[6].date;
  const weekRangeLabel = `Week of ${weekStart.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} – ${weekEnd.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;

  const eventForCell = (day: Date, hour: number) => {
    return events.find((e) => {
      const d = new Date(e.start);
      return isSameDay(d, day) && d.getHours() === hour;
    });
  };

  const upNext = [...events]
    .filter((e) => new Date(e.start).getTime() >= today.getTime() - 86400000)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Meetings, calls and demos — your week, beautifully orchestrated."
        actions={
          <>
            <Button
              variant="glass"
              size="sm"
              onClick={() => setSelected(new Date())}
            >
              <Calendar className="h-4 w-4" />
              Today
            </Button>
            <Button variant="gradient" size="sm">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New event</span>
              <span className="sm:hidden">New</span>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
        <div className="space-y-4">
          <Card variant="glass" className="p-4">
            <CalendarWidget selected={selected} onSelect={setSelected} />
          </Card>

          <Card variant="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Event types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {Object.entries({
                meeting: "Meetings",
                call: "Calls",
                demo: "Demos",
                "follow-up": "Follow-ups",
                internal: "Internal",
              }).map(([k, label]) => {
                const t = typeMap[k as EventType];
                return (
                  <div key={k} className="flex items-center gap-3 text-sm">
                    <span className={cn("h-2.5 w-2.5 rounded-full", t.tone.replace("text-", "bg-"))} />
                    <span className="flex-1 text-muted-foreground">{label}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {events.filter((e) => e.type === k).length}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Up next</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {upNext.map((e) => {
                const t = typeMap[e.type];
                return (
                  <div
                    key={e.id}
                    className={cn(
                      "rounded-lg p-2.5 border-l-2",
                      t.bg,
                      t.border
                    )}
                  >
                    <p className="text-xs font-semibold line-clamp-2">{e.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(e.start).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      ·{" "}
                      {new Date(e.start).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card variant="glass" className="overflow-hidden">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 border-b border-foreground/5">
            <div>
              <CardTitle>{weekRangeLabel}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{events.length} events scheduled</p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Previous week"
                onClick={() => {
                  const d = new Date(selected);
                  d.setDate(d.getDate() - 7);
                  setSelected(d);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Next week"
                onClick={() => {
                  const d = new Date(selected);
                  d.setDate(d.getDate() + 7);
                  setSelected(d);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto scrollbar-thin">
            <div className="min-w-[840px]">
              <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-foreground/5">
                <div className="p-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold" />
                {weekDays.map((day) => {
                  const isToday = isSameDay(day.date, today);
                  return (
                    <div
                      key={day.date.toISOString()}
                      className={cn(
                        "p-3 text-center border-l border-foreground/5",
                        isToday && "bg-primary/[0.05]"
                      )}
                    >
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                        {day.label}
                      </p>
                      <p
                        className={cn(
                          "font-display text-lg font-bold mt-1",
                          isToday && "text-primary"
                        )}
                      >
                        {day.date.getDate()}
                      </p>
                    </div>
                  );
                })}
              </div>

              {hours.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-foreground/5 min-h-[64px]"
                >
                  <div className="p-2 text-[10px] text-muted-foreground font-mono text-right">
                    {hour}:00
                  </div>
                  {weekDays.map((day) => {
                    const evt = eventForCell(day.date, hour);
                    const isToday = isSameDay(day.date, today);
                    return (
                      <div
                        key={day.date.toISOString()}
                        className={cn(
                          "border-l border-foreground/5 p-1 relative",
                          isToday && "bg-primary/[0.03]"
                        )}
                      >
                        {evt && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                              "rounded-lg p-2 border-l-2 cursor-pointer hover:scale-[1.02] transition-transform",
                              typeMap[evt.type].bg,
                              typeMap[evt.type].border
                            )}
                          >
                            <p className="text-[11px] font-semibold leading-tight line-clamp-2">
                              {evt.title}
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                              <Clock className="h-2.5 w-2.5" />
                              {new Date(evt.start).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>All upcoming events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {events.map((evt, i) => {
              const t = typeMap[evt.type];
              const start = new Date(evt.start);
              return (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "rounded-xl p-4 border-l-2 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-colors",
                    t.border
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="ghost" className={cn("capitalize", t.tone)}>
                      {evt.type}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="text-sm font-semibold line-clamp-2">{evt.title}</p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-3">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </span>
                    {evt.location && (
                      <span className="inline-flex items-center gap-1 truncate">
                        {evt.location.includes("Zoom") || evt.location.includes("Meet") ? (
                          <Video className="h-3 w-3" />
                        ) : (
                          <MapPin className="h-3 w-3" />
                        )}
                        {evt.location}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center -space-x-1.5 mt-3">
                    {evt.attendees.slice(0, 3).map((a, idx) => (
                      <Avatar key={idx} className="h-5 w-5 ring-2 ring-card">
                        <AvatarFallback className="text-[8px]">
                          {getInitials(a)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {evt.attendees.length > 3 && (
                      <span className="ml-2 text-[10px] text-muted-foreground inline-flex items-center gap-1">
                        <Users className="h-2.5 w-2.5" />
                        {evt.attendees.length - 3} more
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
