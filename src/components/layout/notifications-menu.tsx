"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Circle,
  Info,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useNotificationsStore } from "@/store/notifications-store";
import type { NotificationLevel } from "@/types";
import Link from "next/link";

const iconMap: Record<NotificationLevel, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const colorMap: Record<NotificationLevel, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
};

export function NotificationsMenu() {
  const items = useNotificationsStore((s) => s.items);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const markRead = useNotificationsStore((s) => s.markRead);
  const unread = items.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-background">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/5">
          <div>
            <p className="font-display font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {unread} unread updates
            </p>
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs">
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-[420px]">
          <ul className="p-1.5">
            {items.map((n, idx) => {
              const Icon = iconMap[n.level];
              return (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => markRead(n.id)}
                  className={cn(
                    "group relative flex gap-3 rounded-lg p-3 cursor-pointer transition-colors hover:bg-foreground/5",
                    !n.read && "bg-primary/[0.04]"
                  )}
                >
                  <div className="shrink-0">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        n.level === "success" && "bg-success/10",
                        n.level === "warning" && "bg-warning/10",
                        n.level === "error" && "bg-destructive/10",
                        n.level === "info" && "bg-info/10"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", colorMap[n.level])} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">
                        {n.title}
                      </p>
                      {!n.read && (
                        <Circle className="h-1.5 w-1.5 fill-primary text-primary shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-snug">
                      {n.body}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-muted-foreground">
                        {formatRelativeTime(n.timestamp)}
                      </span>
                      {n.actionLabel && n.actionHref && (
                        <Link
                          href={n.actionHref}
                          className="text-[11px] font-medium text-primary hover:underline"
                        >
                          {n.actionLabel} →
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </ScrollArea>

        <div className="border-t border-foreground/5 p-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
