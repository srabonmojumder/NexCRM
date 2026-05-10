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
      <header className="sticky top-0 z-30 -mx-4 px-4 lg:-mx-6 lg:px-6 pt-3">
        <div className="glass-strong flex h-14 items-center gap-3 rounded-2xl border-white/10 px-3 shadow-lg">
          <MobileNav />

          <button
            onClick={() => setCommandOpen(true)}
            className="group flex h-10 flex-1 items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground max-w-md"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search anything...</span>
            <span className="sm:hidden">Search</span>
            <kbd className="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 text-[10px] font-mono font-medium opacity-100">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          </button>

          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant="gradient"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              New deal
            </Button>
            <ThemeToggle />
            <NotificationsMenu />
            <div className="hidden sm:block w-px h-6 bg-white/10 mx-1" />
            <UserMenu />
          </div>
        </div>
      </header>
      <CommandMenu />
    </>
  );
}
