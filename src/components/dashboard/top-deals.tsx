"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { deals } from "@/data/mock";
import { formatCurrency, getInitials } from "@/lib/utils";
import type { DealStage } from "@/types";

const stageColor: Record<DealStage, string> = {
  prospecting: "text-muted-foreground",
  qualified: "text-info",
  proposal: "text-warning",
  negotiation: "text-primary",
  won: "text-success",
  lost: "text-destructive",
};

export function TopDeals() {
  const top = [...deals]
    .filter((d) => d.stage !== "lost")
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <ul className="space-y-3">
      {top.map((deal, idx) => (
        <motion.li
          key={deal.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="group rounded-xl p-3 hover:bg-foreground/[0.03] transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={deal.clientAvatar} alt={deal.client} />
              <AvatarFallback>{getInitials(deal.client)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{deal.title}</p>
              <p className="text-[11px] text-muted-foreground capitalize">
                <span className={stageColor[deal.stage]}>● </span>
                {deal.stage}
              </p>
            </div>
            <p className="font-display text-sm font-bold tabular-nums">
              {formatCurrency(deal.value)}
            </p>
          </div>
          <Progress value={deal.probability} className="h-1" />
          <div className="flex items-center justify-between mt-1.5 text-[10px] text-muted-foreground">
            <span>Probability {deal.probability}%</span>
            <span>Closes {new Date(deal.closeDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
