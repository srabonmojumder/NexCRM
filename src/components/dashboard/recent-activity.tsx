"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  CircleDollarSign,
  type LucideIcon,
  Mail,
  MessageSquare,
  PartyPopper,
  PhoneCall,
  Plus,
  Receipt,
  TrendingDown,
  UserPlus,
  Users,
} from "lucide-react";
import { activity } from "@/data/mock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatRelativeTime, getInitials } from "@/lib/utils";
import type { Activity, ActivityKind } from "@/types";

const kindMap: Record<ActivityKind, { icon: LucideIcon; color: string; bg: string }> = {
  deal_won: { icon: PartyPopper, color: "text-success", bg: "bg-success/15" },
  deal_lost: { icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/15" },
  deal_created: { icon: Plus, color: "text-primary", bg: "bg-primary/15" },
  lead_added: { icon: UserPlus, color: "text-info", bg: "bg-info/15" },
  client_added: { icon: Users, color: "text-info", bg: "bg-info/15" },
  meeting_scheduled: { icon: PhoneCall, color: "text-warning", bg: "bg-warning/15" },
  invoice_paid: { icon: CircleDollarSign, color: "text-success", bg: "bg-success/15" },
  invoice_sent: { icon: Receipt, color: "text-primary", bg: "bg-primary/15" },
  comment: { icon: MessageSquare, color: "text-muted-foreground", bg: "bg-foreground/5" },
  task_completed: { icon: CheckCircle2, color: "text-success", bg: "bg-success/15" },
  team_joined: { icon: Mail, color: "text-info", bg: "bg-info/15" },
};

export function RecentActivity({
  items = activity,
  showTimeline = false,
  limit,
}: {
  items?: Activity[];
  showTimeline?: boolean;
  limit?: number;
}) {
  const visible = limit ? items.slice(0, limit) : items;

  return (
    <ul className={cn("relative space-y-1", showTimeline && "before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-white/10")}>
      {visible.map((item, idx) => {
        const k = kindMap[item.kind];
        const Icon = k.icon;
        return (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.3 }}
            className="relative flex gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.03] group"
          >
            <div className="relative shrink-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.actorAvatar} alt={item.actor} />
                <AvatarFallback>{getInitials(item.actor)}</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-card",
                  k.bg,
                  k.color
                )}
              >
                <Icon className="h-3 w-3" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-snug">
                <span className="font-semibold">{item.actor}</span>{" "}
                <span className="text-muted-foreground">{item.description}</span>{" "}
                <span className="font-medium text-foreground/90">{item.target}</span>
                {item.meta && (
                  <>
                    {" "}
                    <span className="font-mono text-xs font-bold text-success">
                      {item.meta}
                    </span>
                  </>
                )}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {formatRelativeTime(item.timestamp)}
              </p>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
