"use client";

import {
  ArrowUpRight,
  CircleDollarSign,
  Download,
  Filter,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChannelChart } from "@/components/charts/channel-chart";
import { GoalsChart } from "@/components/charts/goals-chart";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { TrafficChart } from "@/components/charts/traffic-chart";
import { PageHeader } from "@/components/common/page-header";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatCard } from "@/components/dashboard/stat-card";
import { TopDeals } from "@/components/dashboard/top-deals";
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings";
import { WorldMapLoader } from "@/components/maps/world-map-loader";
import { stats } from "@/data/mock";

const accentByIndex = ["primary", "success", "warning", "info"] as const;
const iconByIndex = [CircleDollarSign, TrendingUp, Zap, Users] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        badge="Live · synced 2 min ago"
        title="Welcome back, Alex 👋"
        description="Here's what's happening across your pipeline today."
        actions={
          <>
            <Button variant="glass" size="sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="glass" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="gradient" size="sm">
              <Zap className="h-4 w-4" />
              AI insights
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard
            key={s.id}
            label={s.label}
            value={s.value}
            delta={s.delta}
            format={s.format}
            series={s.series}
            icon={iconByIndex[i]}
            accent={accentByIndex[i]}
            delay={i * 0.06}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card variant="glass" className="xl:col-span-2 overflow-hidden">
          <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Revenue overview</CardTitle>
              <CardDescription>Monthly revenue & profit performance</CardDescription>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Revenue
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-0.5 text-[11px] font-semibold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Profit
              </span>
            </div>
          </CardHeader>
          <CardContent className="h-[320px] pt-2">
            <RevenueChart />
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle>Traffic sources</CardTitle>
            <CardDescription>Top channels driving inbound this month</CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Live updates from across your team</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link href="/activity">
                View all
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <RecentActivity limit={6} />
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Upcoming</CardTitle>
              <CardDescription>Next 4 meetings</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link href="/calendar">
                Calendar
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <UpcomingMeetings />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle>Top deals</CardTitle>
            <CardDescription>Highest-value open opportunities</CardDescription>
          </CardHeader>
          <CardContent className="px-3">
            <TopDeals />
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle>Channel performance</CardTitle>
            <CardDescription>Deals closed by source</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] pt-2">
            <ChannelChart />
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle>Quarterly goals</CardTitle>
            <CardDescription>Tracking toward Q2 targets</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px]">
            <GoalsChart />
          </CardContent>
        </Card>
      </div>

      <Card variant="glass" className="overflow-hidden">
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>Global client distribution</CardTitle>
            <CardDescription>Active accounts across 8 regions</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link href="/clients">
              View all clients
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[420px] rounded-xl overflow-hidden border border-white/5">
            <WorldMapLoader />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
