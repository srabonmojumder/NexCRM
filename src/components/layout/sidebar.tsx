"use client";

import { motion } from "framer-motion";
import { ChevronsLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { navSections } from "./sidebar-nav";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <TooltipProvider delayDuration={150}>
      <motion.aside
        animate={{ width: sidebarCollapsed ? 80 : 264 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-3 top-3 bottom-3 z-40 hidden lg:flex"
      >
        <div className="glass-strong relative flex h-full w-full flex-col rounded-2xl border-white/10 shadow-2xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div
            className={cn(
              "flex items-center gap-3 px-5 pt-5 pb-4",
              sidebarCollapsed && "justify-center px-2"
            )}
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient shadow-lg shadow-primary/30">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
              <div className="absolute inset-0 rounded-xl bg-brand-gradient blur-md opacity-50 -z-10" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-lg tracking-tight leading-none">
                  NexCRM
                </p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                  Enterprise
                </p>
              </div>
            )}
            {!sidebarCollapsed && (
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={toggleSidebar}
                className="text-muted-foreground"
                aria-label="Collapse sidebar"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3">
            {navSections.map((section, idx) => (
              <div key={idx} className="mb-4">
                {section.label && !sidebarCollapsed && (
                  <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                    {section.label}
                  </p>
                )}
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    const linkContent = (
                      <Link
                        href={item.href}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                          sidebarCollapsed && "justify-center px-2",
                          active
                            ? "bg-primary/15 text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        )}
                      >
                        {active && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-brand-gradient shadow-[0_0_12px_2px] shadow-primary/50"
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          />
                        )}
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            active && "text-primary"
                          )}
                        />
                        {!sidebarCollapsed && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge && (
                              <span className="ml-auto rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    );

                    return (
                      <li key={item.href}>
                        {sidebarCollapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {linkContent}
                            </TooltipTrigger>
                            <TooltipContent side="right" className="font-medium">
                              {item.label}
                              {item.badge && (
                                <span className="ml-2 rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary">
                                  {item.badge}
                                </span>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          linkContent
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {!sidebarCollapsed ? (
            <div className="m-3 rounded-xl bg-gradient-to-br from-primary/15 via-violet-500/10 to-pink-500/10 p-4 border border-white/10 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/20 blur-2xl" />
              <p className="font-display font-semibold text-sm">Upgrade to Pro</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Unlock AI insights, custom reports & priority support.
              </p>
              <Button
                size="sm"
                variant="gradient"
                className="mt-3 w-full"
              >
                Upgrade plan
              </Button>
            </div>
          ) : (
            <div className="flex justify-center pb-3">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={toggleSidebar}
                className="text-muted-foreground rotate-180"
                aria-label="Expand sidebar"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
