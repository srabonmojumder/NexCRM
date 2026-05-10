"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CircleDollarSign,
  MoreHorizontal,
  Plus,
  Tag,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency, getInitials } from "@/lib/utils";
import { usePipelineStore } from "@/store/pipeline-store";
import type { Deal, DealStage } from "@/types";

const stages: { id: DealStage; label: string; tint: string; ring: string }[] = [
  { id: "prospecting", label: "Prospecting", tint: "from-slate-500/10 to-transparent", ring: "ring-slate-400/20" },
  { id: "qualified", label: "Qualified", tint: "from-info/15 to-transparent", ring: "ring-info/20" },
  { id: "proposal", label: "Proposal", tint: "from-warning/15 to-transparent", ring: "ring-warning/20" },
  { id: "negotiation", label: "Negotiation", tint: "from-primary/15 to-transparent", ring: "ring-primary/20" },
  { id: "won", label: "Won", tint: "from-success/15 to-transparent", ring: "ring-success/20" },
  { id: "lost", label: "Lost", tint: "from-destructive/15 to-transparent", ring: "ring-destructive/20" },
];

export function KanbanBoard() {
  const deals = usePipelineStore((s) => s.deals);
  const moveDeal = usePipelineStore((s) => s.moveDeal);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);

  const onDragStart = (id: string) => (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedId(id);
  };

  const onDragOver = (stage: DealStage) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const onDrop = (stage: DealStage) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedId) moveDeal(draggedId, stage);
    setDraggedId(null);
    setDragOverStage(null);
  };

  return (
    <div className="overflow-x-auto scrollbar-thin -mx-4 lg:-mx-6 px-4 lg:px-6 pb-2">
      <div className="grid grid-flow-col auto-cols-[300px] gap-4 min-w-min">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id);
          const total = stageDeals.reduce((s, d) => s + d.value, 0);
          const isOver = dragOverStage === stage.id;
          return (
            <div
              key={stage.id}
              onDragOver={onDragOver(stage.id)}
              onDragLeave={() => setDragOverStage(null)}
              onDrop={onDrop(stage.id)}
              className={cn(
                "flex flex-col rounded-2xl glass border-white/10 transition-all",
                `bg-gradient-to-b ${stage.tint}`,
                isOver && `ring-2 ${stage.ring} scale-[1.01]`
              )}
            >
              <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{stage.label}</h3>
                    <Badge variant="ghost" className="text-[10px]">
                      {stageDeals.length}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-mono tabular-nums">
                    {formatCurrency(total)}
                  </p>
                </div>
                <Button variant="ghost" size="icon-sm" aria-label="Add deal">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 px-3 pb-3 space-y-2 max-h-[68vh] overflow-y-auto scrollbar-thin">
                <AnimatePresence>
                  {stageDeals.map((deal) => (
                    <KanbanCard
                      key={deal.id}
                      deal={deal}
                      onDragStart={onDragStart(deal.id)}
                      isDragging={draggedId === deal.id}
                    />
                  ))}
                </AnimatePresence>

                {stageDeals.length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-muted-foreground">
                    Drop a deal here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KanbanCard({
  deal,
  onDragStart,
  isDragging,
}: {
  deal: Deal;
  onDragStart: (e: React.DragEvent) => void;
  isDragging: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: isDragging ? 0.4 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18 }}
    >
      <div
        draggable
        onDragStart={onDragStart}
        className={cn(
          "group cursor-grab active:cursor-grabbing rounded-xl bg-card/80 border border-white/10 p-3 shadow-sm hover:border-primary/30 hover:shadow-lg transition-all",
          isDragging && "ring-2 ring-primary"
        )}
      >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-semibold leading-snug line-clamp-2">{deal.title}</p>
        <Button
          variant="ghost"
          size="icon-sm"
          className="opacity-0 group-hover:opacity-100 -mr-1 -mt-1 shrink-0"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Avatar className="h-5 w-5">
          <AvatarImage src={deal.clientAvatar} alt={deal.client} />
          <AvatarFallback className="text-[8px]">{getInitials(deal.client)}</AvatarFallback>
        </Avatar>
        <p className="text-[11px] text-muted-foreground truncate">{deal.client}</p>
      </div>

      <div className="flex items-center justify-between mb-2">
        <p className="font-display text-base font-bold tabular-nums">
          {formatCurrency(deal.value)}
        </p>
        <Badge variant="ghost" className="text-[10px]">
          {deal.probability}%
        </Badge>
      </div>

      <Progress value={deal.probability} className="h-1 mb-3" />

      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(deal.closeDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
        <Avatar className="h-5 w-5">
          <AvatarImage src={deal.ownerAvatar} alt={deal.owner} />
          <AvatarFallback className="text-[8px]">{getInitials(deal.owner)}</AvatarFallback>
        </Avatar>
      </div>
      </div>
    </motion.div>
  );
}
