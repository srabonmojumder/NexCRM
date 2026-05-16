"use client";

import { motion } from "framer-motion";
import {
  Activity as ActivityIcon,
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
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/page-header";
import { activity } from "@/data/mock";
import { cn, formatRelativeTime, getInitials } from "@/lib/utils";
import type { Activity, ActivityKind } from "@/types";
import { Search } from "lucide-react";

const kindMap: Record<ActivityKind, { icon: LucideIcon; color: string; bg: string; label: string }> = {
  deal_won: { icon: PartyPopper, color: "text-success", bg: "bg-success/15", label: "Deal won" },
  deal_lost: { icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/15", label: "Deal lost" },
  deal_created: { icon: Plus, color: "text-primary", bg: "bg-primary/15", label: "Deal created" },
  lead_added: { icon: UserPlus, color: "text-info", bg: "bg-info/15", label: "Lead added" },
  client_added: { icon: Users, color: "text-info", bg: "bg-info/15", label: "Client added" },
  meeting_scheduled: { icon: PhoneCall, color: "text-warning", bg: "bg-warning/15", label: "Meeting scheduled" },
  invoice_paid: { icon: CircleDollarSign, color: "text-success", bg: "bg-success/15", label: "Invoice paid" },
  invoice_sent: { icon: Receipt, color: "text-primary", bg: "bg-primary/15", label: "Invoice sent" },
  comment: { icon: MessageSquare, color: "text-muted-foreground", bg: "bg-foreground/5", label: "Comment" },
  task_completed: { icon: CheckCircle2, color: "text-success", bg: "bg-success/15", label: "Task completed" },
  team_joined: { icon: Mail, color: "text-info", bg: "bg-info/15", label: "Team joined" },
};

function groupByDate(items: Activity[]) {
  const groups: Record<string, Activity[]> = {};
  for (const item of items) {
    const d = new Date(item.timestamp);
    const key = d.toDateString();
    (groups[key] ||= []).push(item);
  }
  return Object.entries(groups);
}

export default function ActivityPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    return activity.filter((a) => {
      const q =
        !query ||
        a.actor.toLowerCase().includes(query.toLowerCase()) ||
        a.target.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase());
      const f =
        filter === "all" ||
        (filter === "deals" && a.kind.startsWith("deal_")) ||
        (filter === "leads" && (a.kind === "lead_added" || a.kind === "client_added")) ||
        (filter === "billing" && a.kind.startsWith("invoice_")) ||
        (filter === "team" && (a.kind === "team_joined" || a.kind === "task_completed"));
      return q && f;
    });
  }, [query, filter]);

  const grouped = groupByDate(filtered);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Timeline"
        description="A live, chronological feed of everything happening across your workspace."
        badge="Live feed"
      />

      <div className="flex flex-col md:flex-row gap-3">
        <Input
          placeholder="Search activity..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={<Search className="h-4 w-4" />}
          className="md:w-72"
        />
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="leads">Leads & Clients</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card variant="glass">
        <CardContent className="p-6">
          {grouped.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No activity matches your filters.
            </p>
          ) : (
            <div className="space-y-8">
              {grouped.map(([date, items]) => (
                <section key={date}>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="ghost" className="font-mono">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </Badge>
                    <div className="flex-1 h-px bg-foreground/5" />
                    <span className="text-xs text-muted-foreground">{items.length} events</span>
                  </div>

                  <ul className="relative pl-12 space-y-4 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-foreground/10">
                    {items.map((item, idx) => {
                      const k = kindMap[item.kind];
                      const Icon = k.icon;
                      return (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="relative"
                        >
                          <div
                            className={cn(
                              "absolute -left-12 top-0 flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-background z-10",
                              k.bg
                            )}
                          >
                            <Icon className={cn("h-4 w-4", k.color)} />
                          </div>
                          <div className="rounded-xl border border-foreground/5 bg-foreground/[0.02] p-4 hover:bg-foreground/[0.04] transition-colors">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={item.actorAvatar} alt={item.actor} />
                                  <AvatarFallback className="text-[10px]">
                                    {getInitials(item.actor)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="text-sm leading-snug">
                                    <span className="font-semibold">{item.actor}</span>{" "}
                                    <span className="text-muted-foreground">{item.description}</span>{" "}
                                    <span className="font-medium">{item.target}</span>
                                    {item.meta && (
                                      <span className="ml-2 font-mono text-xs font-bold text-success">
                                        {item.meta}
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground mt-1">
                                    {formatRelativeTime(item.timestamp)}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="ghost" className="text-[10px]">
                                {k.label}
                              </Badge>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
