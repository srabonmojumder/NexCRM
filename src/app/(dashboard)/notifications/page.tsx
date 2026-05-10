"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  CheckCircle2,
  Info,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/page-header";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useNotificationsStore } from "@/store/notifications-store";
import type { NotificationLevel } from "@/types";

const iconMap: Record<NotificationLevel, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const colorMap: Record<NotificationLevel, { text: string; bg: string }> = {
  info: { text: "text-info", bg: "bg-info/15" },
  success: { text: "text-success", bg: "bg-success/15" },
  warning: { text: "text-warning", bg: "bg-warning/15" },
  error: { text: "text-destructive", bg: "bg-destructive/15" },
};

export default function NotificationsPage() {
  const items = useNotificationsStore((s) => s.items);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const markRead = useNotificationsStore((s) => s.markRead);
  const remove = useNotificationsStore((s) => s.remove);
  const unread = items.filter((n) => !n.read).length;

  const renderList = (visible: typeof items) => (
    <ul className="space-y-2">
      {visible.length === 0 && (
        <li className="text-center py-12 text-sm text-muted-foreground">
          You&apos;re all caught up.
        </li>
      )}
      {visible.map((n, idx) => {
        const Icon = iconMap[n.level];
        const c = colorMap[n.level];
        return (
          <motion.li
            key={n.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            <Card
              variant="glass"
              className={cn(
                "p-4 group transition-colors hover:bg-white/[0.04]",
                !n.read && "border-l-2 border-l-primary"
              )}
            >
              <div className="flex gap-3">
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", c.bg)}>
                  <Icon className={cn("h-4 w-4", c.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {n.body}
                      </p>
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      {formatRelativeTime(n.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {n.actionLabel && n.actionHref && (
                      <Button asChild size="sm" variant="glass">
                        <Link href={n.actionHref}>{n.actionLabel}</Link>
                      </Button>
                    )}
                    {!n.read && (
                      <Button size="sm" variant="ghost" onClick={() => markRead(n.id)}>
                        Mark as read
                      </Button>
                    )}
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="ml-auto text-muted-foreground opacity-0 group-hover:opacity-100"
                      onClick={() => remove(n.id)}
                      aria-label="Dismiss"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.li>
        );
      })}
    </ul>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        badge={unread > 0 ? `${unread} unread` : "All caught up"}
        title="Notifications"
        description="Everything that needs your attention, all in one place."
        actions={
          unread > 0 && (
            <Button variant="glass" size="sm" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )
        }
      />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({items.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unread})</TabsTrigger>
          <TabsTrigger value="success">Wins</TabsTrigger>
          <TabsTrigger value="warning">Action needed</TabsTrigger>
        </TabsList>
        <TabsContent value="all">{renderList(items)}</TabsContent>
        <TabsContent value="unread">{renderList(items.filter((i) => !i.read))}</TabsContent>
        <TabsContent value="success">
          {renderList(items.filter((i) => i.level === "success"))}
        </TabsContent>
        <TabsContent value="warning">
          {renderList(items.filter((i) => i.level === "warning" || i.level === "error"))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
