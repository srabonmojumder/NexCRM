"use client";

import { Filter, Plus, Settings2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { usePipelineStore } from "@/store/pipeline-store";
import { formatCurrency } from "@/lib/utils";

export default function PipelinePage() {
  const deals = usePipelineStore((s) => s.deals);

  const totalValue = deals
    .filter((d) => d.stage !== "lost" && d.stage !== "won")
    .reduce((s, d) => s + d.value, 0);
  const wonValue = deals
    .filter((d) => d.stage === "won")
    .reduce((s, d) => s + d.value, 0);
  const weightedValue = deals
    .filter((d) => d.stage !== "lost" && d.stage !== "won")
    .reduce((s, d) => s + (d.value * d.probability) / 100, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Pipeline"
        description="Drag and drop deals across stages — track every opportunity in motion."
        actions={
          <>
            <Button variant="glass" size="sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="glass" size="sm">
              <Settings2 className="h-4 w-4" />
              Customize
            </Button>
            <Button variant="gradient" size="sm">
              <Plus className="h-4 w-4" />
              New deal
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card variant="glass" className="p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Open pipeline
          </p>
          <p className="font-display text-xl font-bold mt-1.5">
            {formatCurrency(totalValue)}
          </p>
        </Card>
        <Card variant="glass" className="p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Weighted forecast
          </p>
          <p className="font-display text-xl font-bold mt-1.5 text-primary">
            {formatCurrency(Math.round(weightedValue))}
          </p>
        </Card>
        <Card variant="glass" className="p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Won this month
          </p>
          <p className="font-display text-xl font-bold mt-1.5 text-success">
            {formatCurrency(wonValue)}
          </p>
        </Card>
        <Card variant="glass" className="p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Avg. deal cycle
          </p>
          <p className="font-display text-xl font-bold mt-1.5 inline-flex items-baseline gap-1">
            22
            <span className="text-xs text-muted-foreground font-medium">days</span>
            <Badge variant="success" className="text-[10px] ml-1">
              <TrendingUp className="h-3 w-3" />
              4d faster
            </Badge>
          </p>
        </Card>
      </div>

      <KanbanBoard />
    </div>
  );
}
