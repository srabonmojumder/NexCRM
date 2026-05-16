"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-5 md:mb-6",
        className
      )}
    >
      <div className="space-y-1.5 min-w-0">
        {badge && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/5 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            {badge}
          </span>
        )}
        <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap [&>*]:shrink-0">{actions}</div>
      )}
    </motion.div>
  );
}
