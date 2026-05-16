"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Download,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChannelChart } from "@/components/charts/channel-chart";
import { ConversionChart } from "@/components/charts/conversion-chart";
import { FunnelChart } from "@/components/charts/funnel-chart";
import { GoalsChart } from "@/components/charts/goals-chart";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { TrafficChart } from "@/components/charts/traffic-chart";
import { PageHeader } from "@/components/common/page-header";
import { cn, formatCompact } from "@/lib/utils";

const microStats = [
  { label: "Sessions", value: "248k", delta: 12.4, accent: "text-foreground" },
  { label: "Sign-ups", value: "8.4k", delta: 6.8, accent: "text-foreground" },
  { label: "Activation", value: "62%", delta: 2.1, accent: "text-success" },
  { label: "Churn", value: "1.8%", delta: -0.4, accent: "text-success" },
  { label: "ARPU", value: "$184", delta: 4.7, accent: "text-foreground" },
  { label: "MRR", value: "$284k", delta: 11.2, accent: "text-foreground" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        badge="Analytics · Last 30 days"
        title="Analytics"
        description="Granular performance across acquisition, conversion and revenue."
        actions={
          <>
            <Select defaultValue="30">
              <SelectTrigger className="w-[120px] sm:w-[140px]">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="glass" size="sm" className="hidden sm:inline-flex">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="glass" size="icon-sm" className="sm:hidden" aria-label="Export PDF">
              <Download className="h-4 w-4" />
            </Button>
          </>
        }
      />

      <Card variant="glass" className="overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-foreground/5">
          {microStats.map((s) => {
            const positive = s.delta >= 0;
            return (
              <div key={s.label} className="p-4">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  {s.label}
                </p>
                <p className={cn("font-display text-xl font-bold mt-1.5", s.accent)}>
                  {s.value}
                </p>
                <p
                  className={cn(
                    "text-[11px] inline-flex items-center gap-0.5 mt-1 font-semibold",
                    positive ? "text-success" : "text-destructive"
                  )}
                >
                  {positive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {Math.abs(s.delta)}%
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card variant="glass" className="xl:col-span-2 overflow-hidden">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Revenue & profit</CardTitle>
                <CardDescription>Monthly trend over the last year</CardDescription>
              </div>
              <Badge variant="success">
                <TrendingUp className="h-3 w-3" />
                +14.2% YoY
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[260px] sm:h-[340px]">
            <RevenueChart />
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Conversion funnel</CardTitle>
            <CardDescription>From visit to paid customer</CardDescription>
          </CardHeader>
          <CardContent>
            <FunnelChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Traffic sources</CardTitle>
            <CardDescription>Where customers find you</CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficChart />
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Conversion rate by stage</CardTitle>
            <CardDescription>Weekly funnel performance</CardDescription>
          </CardHeader>
          <CardContent className="h-[240px] sm:h-[260px]">
            <ConversionChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Channel performance</CardTitle>
            <CardDescription>Deals closed per channel</CardDescription>
          </CardHeader>
          <CardContent className="h-[240px] sm:h-[280px]">
            <ChannelChart />
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Goal tracker</CardTitle>
                <CardDescription>Q2 targets</CardDescription>
              </div>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="h-[240px] sm:h-[280px]">
            <GoalsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
