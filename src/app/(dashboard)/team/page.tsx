"use client";

import { motion } from "framer-motion";
import {
  Award,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/page-header";
import { team } from "@/data/mock";
import { cn, formatCompact, getInitials } from "@/lib/utils";
import type { TeamRole } from "@/types";

const statusColor = {
  online: "bg-success",
  busy: "bg-warning",
  away: "bg-muted-foreground",
  offline: "bg-muted-foreground/40",
};

const roleBadge: Record<TeamRole, "default" | "info" | "secondary" | "success"> = {
  admin: "default",
  manager: "info",
  rep: "success",
  support: "secondary",
};

export default function TeamPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(
    () =>
      team.filter((m) => {
        const q =
          !query ||
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.email.toLowerCase().includes(query.toLowerCase());
        const r = filter === "all" || m.role === filter;
        return q && r;
      }),
    [query, filter]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Your humans of NexCRM. Performance, presence and impact at a glance."
        actions={
          <Button variant="gradient" size="sm">
            <Plus className="h-4 w-4" />
            Invite teammate
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total members", value: team.length },
          { label: "Online now", value: team.filter((m) => m.status === "online").length, accent: "text-success" },
          {
            label: "Avg. performance",
            value: `${Math.round(team.reduce((s, m) => s + m.performance, 0) / team.length)}%`,
            accent: "text-primary",
          },
          {
            label: "Total revenue",
            value: `$${formatCompact(team.reduce((s, m) => s + m.revenue, 0))}`,
            accent: "text-info",
          },
        ].map((s) => (
          <Card key={s.label} variant="glass" className="p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              {s.label}
            </p>
            <p className={cn("font-display text-xl font-bold mt-1.5", s.accent)}>
              {s.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <Input
          placeholder="Search team..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={<Search className="h-4 w-4" />}
          className="md:w-72"
        />
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
            <TabsTrigger value="manager">Managers</TabsTrigger>
            <TabsTrigger value="rep">Reps</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card variant="glass" className="p-5 card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 bg-brand-gradient opacity-10 blur-3xl rounded-full" />
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 ring-2 ring-foreground/10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full ring-2 ring-card",
                      statusColor[member.status]
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-base truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant={roleBadge[member.role]} className="capitalize text-[10px]">
                      {member.role}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5" />
                      {member.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Performance
                  </span>
                  <span className="font-mono text-xs font-semibold tabular-nums">
                    {member.performance}%
                  </span>
                </div>
                <Progress value={member.performance} className="h-1.5" />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-foreground/5">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Deals closed
                  </p>
                  <p className="font-display font-bold text-lg tabular-nums">
                    {member.dealsClosed}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Revenue
                  </p>
                  <p className="font-display font-bold text-lg tabular-nums">
                    ${formatCompact(member.revenue)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-4">
                <Button variant="glass" size="sm" className="flex-1">
                  <Mail className="h-3.5 w-3.5" />
                </Button>
                <Button variant="glass" size="sm" className="flex-1">
                  <Phone className="h-3.5 w-3.5" />
                </Button>
                <Button variant="glass" size="sm" className="flex-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
