"use client";

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
import { SidebarNavList } from "./sidebar-shared";

// Kept in sync with the main padding in dashboard-layout.tsx
// (left-3 gap + width + right gap → lg:pl-[104px] / lg:pl-[288px]).
const EXPANDED_WIDTH = 264;
const COLLAPSED_WIDTH = 80;

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        style={{ width: sidebarCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
        className="fixed left-3 top-3 bottom-3 z-40 hidden lg:flex transition-[width] duration-300 ease-out motion-reduce:transition-none"
      >
        <div className="glass-strong relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-foreground/10 shadow-2xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

          {/* Collapse / expand toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label={
                  sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                }
                className="absolute -right-3 top-7 z-20 grid h-6 w-6 place-items-center rounded-full border border-foreground/10 bg-card text-muted-foreground shadow-md transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
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

          {/* Header / logo */}
          <div
            className={cn(
              "flex h-[72px] shrink-0 items-center",
              sidebarCollapsed ? "justify-center px-0" : "px-5"
            )}
          >
            <Link
              href="/"
              className="flex items-center"
              aria-label="NexCRM home"
            >
              {sidebarCollapsed ? (
                <LogoMark size="md" priority />
              ) : (
                <Logo
                  size="md"
                  priority
                  className="h-11 w-auto max-w-[170px]"
                />
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin px-3 pt-1 pb-3">
            <SidebarNavList pathname={pathname} collapsed={sidebarCollapsed} />
          </nav>

          {/* Upgrade footer */}
          <div className="shrink-0 p-3">
            {sidebarCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="Upgrade to Pro"
                    className="relative mx-auto grid h-11 w-11 place-items-center rounded-xl border border-foreground/10 bg-gradient-to-br from-primary/20 via-violet-500/15 to-pink-500/15 transition-colors hover:border-primary/30"
                  >
                    <span className="gradient-text font-display text-[11px] font-bold">
                      PRO
                    </span>
                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-warning ring-2 ring-card" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>
                  Upgrade to Pro
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="relative overflow-hidden rounded-xl border border-foreground/10 bg-gradient-to-br from-primary/15 via-violet-500/10 to-pink-500/10 p-4">
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/20 blur-2xl" />
                <p className="relative font-display text-sm font-semibold">
                  Upgrade to Pro
                </p>
                <p className="relative mt-1 text-xs leading-relaxed text-muted-foreground">
                  Unlock AI insights, custom reports &amp; priority support.
                </p>
                <Button
                  size="sm"
                  variant="gradient"
                  className="relative mt-3 w-full"
                >
                  Upgrade plan
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
