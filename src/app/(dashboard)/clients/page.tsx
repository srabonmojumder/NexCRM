"use client";

import { motion } from "framer-motion";
import {
  Download,
  Globe2,
  Grid3X3,
  List,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/page-header";
import { WorldMapLoader } from "@/components/maps/world-map-loader";
import { clients } from "@/data/mock";
import { cn, formatCompact, formatCurrency, formatDate, getInitials } from "@/lib/utils";
import type { ClientStatus, ClientTier } from "@/types";

const statusColor: Record<ClientStatus, string> = {
  active: "bg-success",
  trial: "bg-info",
  paused: "bg-warning",
  churned: "bg-destructive",
};

const tierBadge: Record<ClientTier, "default" | "secondary" | "info"> = {
  starter: "secondary",
  growth: "info",
  enterprise: "default",
};

export default function ClientsPage() {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(
    () =>
      clients.filter((c) => {
        const q =
          !query ||
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.company.toLowerCase().includes(query.toLowerCase());
        const t = tier === "all" || c.tier === tier;
        return q && t;
      }),
    [query, tier]
  );

  const totalMRR = clients.reduce((s, c) => s + c.mrr, 0);
  const activeClients = clients.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Your customer book — relationships, revenue and health."
        actions={
          <>
            <Button variant="glass" size="sm" className="hidden sm:inline-flex">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="glass" size="icon-sm" className="sm:hidden" aria-label="Export">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="gradient" size="sm">
              <Plus className="h-4 w-4" />
              Add client
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total clients", value: clients.length, accent: "text-foreground" },
          { label: "Active", value: activeClients, accent: "text-success" },
          { label: "Total MRR", value: formatCurrency(totalMRR), accent: "text-primary" },
          {
            label: "Avg LTV",
            value: formatCurrency(
              Math.round(clients.reduce((s, c) => s + c.ltv, 0) / clients.length)
            ),
            accent: "text-info",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card variant="glass" className="p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                {s.label}
              </p>
              <p className={cn("font-display text-xl font-bold mt-1.5", s.accent)}>
                {s.value}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card variant="glass">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-primary" />
            Where your clients are
          </CardTitle>
          <Badge variant="ghost">{clients.length} accounts</Badge>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] sm:h-[320px] lg:h-[360px] rounded-xl overflow-hidden border border-foreground/5">
            <WorldMapLoader />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <TabsList className="overflow-x-auto scrollbar-thin">
            <TabsTrigger value="all">All clients</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="trial">Trials</TabsTrigger>
            <TabsTrigger value="churned">Churned</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 flex-wrap">
            <Input
              placeholder="Search clients..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
              className="flex-1 min-w-[160px] md:w-64 md:flex-none"
            />
            <Select value={tier} onValueChange={setTier}>
              <SelectTrigger className="w-[110px] sm:w-[130px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tiers</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="growth">Growth</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center rounded-lg glass p-1">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  view === "grid" ? "bg-primary/20 text-primary" : "text-muted-foreground"
                )}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  view === "list" ? "bg-primary/20 text-primary" : "text-muted-foreground"
                )}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <TabsContent value="all" className="mt-4">
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card variant="glass" className="p-5 card-hover group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12 ring-2 ring-foreground/10">
                          <AvatarImage src={c.avatar} alt={c.name} />
                          <AvatarFallback>{getInitials(c.name)}</AvatarFallback>
                        </Avatar>
                        <span
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-card",
                            statusColor[c.status]
                          )}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-display font-semibold text-base truncate">
                      {c.company}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {c.name} · {c.industry}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant={tierBadge[c.tier]} className="capitalize text-[10px]">
                        {c.tier}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {c.location.city}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-foreground/5">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          MRR
                        </p>
                        <p className="font-display font-bold text-sm tabular-nums mt-0.5">
                          {c.mrr ? formatCurrency(c.mrr) : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          LTV
                        </p>
                        <p className="font-display font-bold text-sm tabular-nums mt-0.5">
                          ${formatCompact(c.ltv)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-4">
                      <Button variant="glass" size="sm" className="flex-1 text-xs">
                        <Mail className="h-3.5 w-3.5" />
                        Email
                      </Button>
                      <Button variant="glass" size="sm" className="flex-1 text-xs">
                        <Phone className="h-3.5 w-3.5" />
                        Call
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card variant="glass">
              <ul className="divide-y divide-foreground/5">
                {filtered.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-4 p-4 hover:bg-foreground/[0.03] transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={c.avatar} alt={c.name} />
                        <AvatarFallback>{getInitials(c.name)}</AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-card",
                          statusColor[c.status]
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{c.company}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.name} · {c.industry} · {c.location.city}
                      </p>
                    </div>
                    <Badge variant={tierBadge[c.tier]} className="capitalize">
                      {c.tier}
                    </Badge>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground">MRR</p>
                      <p className="font-display font-semibold text-sm tabular-nums">
                        {c.mrr ? formatCurrency(c.mrr) : "—"}
                      </p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-muted-foreground">Joined</p>
                      <p className="text-xs">{formatDate(c.joinedAt)}</p>
                    </div>
                    <Button variant="ghost" size="icon-sm">
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </TabsContent>

        {(["active", "trial", "churned"] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered
                .filter((c) => c.status === tab)
                .map((c) => (
                  <Card key={c.id} variant="glass" className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={c.avatar} alt={c.name} />
                        <AvatarFallback>{getInitials(c.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{c.company}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.name}</p>
                      </div>
                    </div>
                    <Badge variant={tierBadge[c.tier]} className="capitalize">
                      {c.tier}
                    </Badge>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
