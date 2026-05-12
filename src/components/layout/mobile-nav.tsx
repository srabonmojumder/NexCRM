"use client";

import { ChevronRight, LogOut, Menu, Search, Settings, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/logo";
import { cn, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { navSections } from "./sidebar-nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const setCommandOpen = useUIStore((s) => s.setCommandOpen);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-[60] bg-black/70 backdrop-blur-md transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={cn(
          "fixed left-0 top-0 z-[70] flex h-[100dvh] w-[88vw] max-w-[320px] flex-col overflow-hidden rounded-r-2xl bg-card shadow-2xl ring-1 ring-white/10 transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/3 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl"
        />

        <div className="relative flex shrink-0 items-center justify-between gap-2 px-4 pt-4 pb-3">
          <Logo size="sm" priority className="h-9 w-auto max-w-[140px]" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-muted-foreground transition-colors hover:bg-white/[0.08] hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {user && (
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="group relative mx-3 mb-3 flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-3 transition-colors hover:border-white/20"
          >
            <div className="relative">
              <Avatar className="h-11 w-11 ring-2 ring-primary/30">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-card" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}

        <div className="relative mx-3 mb-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setCommandOpen(true);
            }}
            className="flex h-10 w-full items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-muted-foreground transition-colors hover:bg-white/[0.08] hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search…</span>
            <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        <nav className="scrollbar-thin relative min-h-0 flex-1 overflow-y-auto px-3 pb-2">
          {navSections.map((section, idx) => (
            <div key={idx} className="mb-3 last:mb-0">
              {section.label && (
                <div className="flex items-center gap-2 px-3 pb-1.5 pt-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">
                    {section.label}
                  </p>
                  <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-[5px] px-2.5 py-2.5 text-sm font-medium transition-all duration-200",
                          active
                            ? "bg-gradient-to-r from-primary/[0.18] via-primary/[0.08] to-transparent text-foreground"
                            : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                        )}
                      >
                        {active && (
                          <span
                            aria-hidden
                            className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-brand-gradient shadow-[0_0_10px_1px] shadow-primary/50"
                          />
                        )}
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] transition-all",
                            active
                              ? "bg-primary/15 text-primary ring-1 ring-inset ring-primary/20"
                              : "bg-white/[0.04] text-muted-foreground group-hover:bg-white/[0.08] group-hover:text-foreground"
                          )}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {item.label}
                        </span>
                        {item.badge ? (
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                              active
                                ? "bg-primary/25 text-primary"
                                : "bg-white/10 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : active ? (
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="relative shrink-0 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 via-violet-500/15 to-pink-500/15 p-3.5">
            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/25 blur-2xl" />
            <div className="absolute -left-4 -bottom-4 h-16 w-16 rounded-full bg-pink-500/20 blur-2xl" />
            <div className="relative flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <p className="font-display text-sm font-semibold">Upgrade to Pro</p>
            </div>
            <p className="relative mt-1.5 text-xs leading-relaxed text-foreground/75">
              Unlock AI insights, custom reports & priority support.
            </p>
            <Button
              size="sm"
              variant="gradient"
              className="relative mt-3 h-9 w-full"
            >
              Upgrade plan
            </Button>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[5px] border border-white/10 bg-white/[0.03] px-2 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>
            <button
              type="button"
              onClick={() => {
                signOut();
                setOpen(false);
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[5px] border border-white/10 bg-white/[0.03] px-2 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
