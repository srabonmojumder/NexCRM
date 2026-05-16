"use client";

import { ChevronRight, LogOut, Menu, Search, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/logo";
import { cn, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { SidebarNavList } from "./sidebar-shared";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const setCommandOpen = useUIStore((s) => s.setCommandOpen);
  const onClose = () => setOpen(false);

  // Portal target is only available on the client.
  useEffect(() => setMounted(true), []);

  // Lock body scroll + close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close the drawer on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/*
        The drawer is portaled to <body>. It must NOT render inside the topbar,
        whose `.glass-strong` backdrop-filter creates a containing block that
        would trap `position: fixed` and break the drawer's positioning.
      */}
      {mounted &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              aria-hidden
              onClick={onClose}
              className={cn(
                "fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden",
                "transition-opacity duration-300",
                open ? "opacity-100" : "pointer-events-none opacity-0"
              )}
            />

            {/* Drawer */}
            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Main menu"
              className={cn(
                "fixed inset-y-0 left-0 z-[70] flex w-[85vw] max-w-[320px] flex-col",
                "overflow-hidden border-r border-border bg-background text-foreground",
                "shadow-[0_30px_80px_-20px_rgba(15,23,42,0.45)]",
                "transition-transform duration-300 ease-out lg:hidden",
                "motion-reduce:transition-none",
                open ? "translate-x-0" : "-translate-x-[105%]"
              )}
            >
              {/* Pinned: header */}
              <div className="flex shrink-0 items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
                <Link href="/" onClick={onClose} className="flex items-center">
                  <Logo
                    size="sm"
                    priority
                    className="h-9 w-auto max-w-[140px]"
                  />
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Pinned: search */}
              <div className="mx-4 mb-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setCommandOpen(true);
                  }}
                  className="relative flex h-10 w-full items-center rounded-xl border border-border bg-muted/50 pl-9 pr-12 text-left text-sm text-muted-foreground transition-colors hover:bg-muted focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  Quick search...
                  <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    ⌘K
                  </kbd>
                </button>
              </div>

              {/* Scrollable: navigation + upgrade banner */}
              <nav className="scrollbar-thin flex-1 overflow-y-auto overscroll-contain px-3 pt-1 pb-3">
                <SidebarNavList pathname={pathname} onNavigate={onClose} />

                <button
                  type="button"
                  className="mt-4 flex w-full items-center gap-3 rounded-xl border border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-3 text-left transition-colors hover:from-primary/15"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground">
                      Upgrade to Pro
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      AI insights + priority support
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              </nav>

              {/* Pinned: slim footer — user identity + sign out */}
              {user && (
                <div className="flex shrink-0 items-center gap-2 border-t border-border px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                  <Link
                    href="/settings"
                    onClick={onClose}
                    className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-muted"
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {user.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </Link>
                  <button
                    type="button"
                    aria-label="Sign out"
                    onClick={() => {
                      signOut();
                      onClose();
                    }}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
            </aside>
          </>,
          document.body
        )}
    </>
  );
}
