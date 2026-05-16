"use client";

import { Plus, Search } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";
import { CommandMenu } from "./command-menu";
import { MobileNav } from "./mobile-nav";
import { NotificationsMenu } from "./notifications-menu";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function Topbar() {
  const setCommandOpen = useUIStore((s) => s.setCommandOpen);

  return (
    <>
      <header className="sticky top-0 z-30 -mx-4 px-4 sm:-mx-5 sm:px-5 lg:-mx-6 lg:px-6 pt-3">
        <div className="glass-strong flex h-14 items-center gap-2 sm:gap-3 rounded-2xl border-foreground/10 px-2 sm:px-3 shadow-lg">
          <MobileNav />

          <button
            onClick={() => setCommandOpen(true)}
            className="group flex h-9 sm:h-10 flex-1 items-center gap-2 sm:gap-3 rounded-xl border border-foreground/10 bg-foreground/5 px-2.5 sm:px-3 text-sm text-muted-foreground transition-[background-color,border-color,color,box-shadow] duration-200 ease-out hover:bg-foreground/10 hover:border-foreground/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/40 max-w-md min-w-0"
          >
            <Search className="h-4 w-4 shrink-0 transition-colors duration-200 group-hover:text-primary" />
            <span className="hidden sm:inline truncate">Search anything...</span>
            <span className="sm:hidden truncate">Search</span>
            <kbd className="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-foreground/10 bg-foreground/[0.06] px-1.5 text-[10px] font-mono font-medium text-muted-foreground transition-colors duration-200 group-hover:border-primary/30 group-hover:text-foreground">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          </button>

          <div className="flex items-center gap-0.5 sm:gap-1 ml-auto shrink-0">
            <Button
              variant="gradient"
              size="sm"
              className="hidden md:inline-flex"
            >
              <Plus className="h-4 w-4" />
              New deal
            </Button>
            <ThemeToggle />
            <NotificationsMenu />
            <div className="hidden sm:block w-px h-6 bg-foreground/10 mx-1" />
            <UserMenu />
          </div>
        </div>
      </header>
      <CommandMenu />
    </>
  );
}
