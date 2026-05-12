"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo, LogoMark } from "@/components/common/logo";
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
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-3 top-3 bottom-3 z-40 hidden lg:flex"
      >
        <div className="glass-strong relative flex h-full w-full flex-col rounded-2xl border-white/10 shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="absolute -right-3 top-7 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-white/10 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/10 shadow-md transition-all"
              >
                <ChevronLeft
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-300",
                    sidebarCollapsed && "rotate-180"
                  )}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              {sidebarCollapsed ? "Expand" : "Collapse"}
            </TooltipContent>
          </Tooltip>

          <div
            className={cn(
              "flex items-center pt-5 pb-4 transition-[padding] duration-300",
              sidebarCollapsed ? "px-0 justify-center" : "px-5 justify-start"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {sidebarCollapsed ? (
                <motion.div
                  key="mark"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.2 }}
                >
                  <LogoMark size="md" priority />
                </motion.div>
              ) : (
                <motion.div
                  key="full"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.22 }}
                  className="flex min-w-0 items-center"
                >
                  <Logo size="md" priority className="h-14 w-auto max-w-[180px]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin px-2 pb-3">
            {navSections.map((section, idx) => (
              <div key={idx} className="mb-4">
                <div className="h-5 mb-1 px-3">
                  <AnimatePresence>
                    {section.label && !sidebarCollapsed && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18, delay: 0.05 }}
                        className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 leading-5"
                      >
                        {section.label}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    const linkContent = (
                      <Link
                        href={item.href}
                        className={cn(
                          "group relative flex items-center text-sm font-medium transition-colors duration-200 rounded-[5px]",
                          sidebarCollapsed
                            ? "h-11 w-11 mx-auto justify-center"
                            : "gap-3 px-3 py-2.5",
                          active
                            ? "text-foreground bg-primary/[0.12]"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId={
                              sidebarCollapsed
                                ? "active-bg-collapsed"
                                : "active-bg-expanded"
                            }
                            className={cn(
                              "absolute inset-0 rounded-[5px] pointer-events-none -z-10",
                              "bg-gradient-to-r from-primary/15 via-primary/[0.08] to-transparent",
                              "ring-1 ring-inset ring-primary/15"
                            )}
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                          />
                        )}

                        <Icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0 transition-colors duration-200",
                            active
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />

                        <AnimatePresence>
                          {!sidebarCollapsed && (
                            <motion.span
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -6 }}
                              transition={{ duration: 0.18, delay: 0.04 }}
                              className="flex-1 truncate flex items-center gap-2 min-w-0"
                            >
                              <span className="truncate">{item.label}</span>
                              {item.badge && (
                                <span
                                  className={cn(
                                    "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold shrink-0",
                                    active
                                      ? "bg-primary/25 text-primary"
                                      : "bg-white/10 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                                  )}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {sidebarCollapsed && item.badge && (
                          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary ring-2 ring-card animate-pulse" />
                        )}
                      </Link>
                    );

                    return (
                      <li key={item.href} className="relative">
                        {active && !sidebarCollapsed && (
                          <motion.span
                            layoutId="sidebar-edge-bar"
                            className="absolute -left-2 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-brand-gradient shadow-[0_0_12px_2px] shadow-primary/60 pointer-events-none z-10"
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                          />
                        )}
                        {sidebarCollapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {linkContent}
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              className="font-medium"
                              sideOffset={14}
                            >
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

          <AnimatePresence initial={false}>
            {!sidebarCollapsed ? (
              <motion.div
                key="upgrade-card"
                initial={{ opacity: 0, y: 12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 8, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="m-3 rounded-xl bg-gradient-to-br from-primary/15 via-violet-500/10 to-pink-500/10 p-4 border border-white/10 relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/20 blur-2xl" />
                  <div className="absolute -left-4 -bottom-4 h-16 w-16 rounded-full bg-pink-500/15 blur-2xl" />
                  <p className="font-display font-semibold text-sm relative">Upgrade to Pro</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed relative">
                    Unlock AI insights, custom reports & priority support.
                  </p>
                  <Button size="sm" variant="gradient" className="mt-3 w-full relative">
                    Upgrade plan
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="upgrade-mark"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.22, delay: 0.05 }}
                className="flex justify-center pb-4"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      aria-label="Upgrade to Pro"
                      className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-violet-500/15 to-pink-500/15 border border-white/10 hover:scale-105 hover:border-primary/30 transition-all"
                    >
                      <span className="font-display text-[11px] font-bold gradient-text">PRO</span>
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-warning ring-2 ring-card animate-pulse" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={14}>
                    Upgrade to Pro
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
