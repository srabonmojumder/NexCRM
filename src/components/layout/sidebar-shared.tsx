"use client";

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { navSections, type NavItem } from "./sidebar-nav";

/** A nav item is active on an exact match, or when the route is nested under it. */
export function isNavActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-1.5 pt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 first:pt-1">
      {children}
    </p>
  );
}

interface NavRowProps {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}

function NavRow({ item, active, collapsed, onNavigate }: NavRowProps) {
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center rounded-xl text-sm font-medium",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        collapsed ? "h-10 w-10 justify-center" : "h-10 gap-3 px-2.5",
        active
          ? "bg-primary/10 text-foreground"
          : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
      )}
    >
      {active && !collapsed && (
        <span className="absolute -left-2 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-gradient" />
      )}

      <span
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors duration-200",
          active
            ? "bg-primary/20 text-primary"
            : "bg-foreground/[0.06] text-muted-foreground group-hover:bg-foreground/10 group-hover:text-foreground"
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>

      {!collapsed && (
        <>
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums",
                active
                  ? "bg-primary/20 text-primary"
                  : "bg-foreground/10 text-muted-foreground"
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}

      {collapsed && item.badge && (
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
      )}
    </Link>
  );

  if (!collapsed) {
    return <li>{link}</li>;
  }

  return (
    <li className="flex justify-center">
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={12} className="font-medium">
          {item.label}
          {item.badge && (
            <span className="ml-1.5 rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    </li>
  );
}

interface SidebarNavListProps {
  pathname: string;
  /** Desktop icon-rail mode. Mobile always passes `false`. */
  collapsed?: boolean;
  /** Called after navigating — used by the mobile drawer to close itself. */
  onNavigate?: () => void;
}

/**
 * Shared navigation list rendered by both the desktop sidebar and the mobile
 * drawer, so the menu structure, badges and active states stay identical.
 */
export function SidebarNavList({
  pathname,
  collapsed = false,
  onNavigate,
}: SidebarNavListProps) {
  return (
    <div className="space-y-0.5">
      {navSections.map((section, idx) => (
        <div key={idx}>
          {section.label &&
            (collapsed ? (
              idx > 0 && (
                <div className="mx-auto my-2 h-px w-6 bg-border" />
              )
            ) : (
              <SectionLabel>{section.label}</SectionLabel>
            ))}
          <ul className={cn(collapsed ? "space-y-1.5" : "space-y-0.5")}>
            {section.items.map((item) => (
              <NavRow
                key={item.href}
                item={item}
                active={isNavActive(pathname, item.href)}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
