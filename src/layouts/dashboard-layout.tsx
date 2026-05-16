"use client";

import { useState } from "react";
import { useUIStore } from "@/store/ui-store";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";

export function DashboardLayout({
  children,
  defaultCollapsed = false,
}: {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}) {
  // Seed the store with the server-resolved cookie value once, before the first
  // paint, so SSR and the initial client render agree (no hydration flash).
  useState(() => {
    useUIStore.setState({ sidebarCollapsed: defaultCollapsed });
  });

  const collapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid-pattern-light dark:bg-grid-pattern opacity-[0.5] dark:opacity-[0.04] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <div className="pointer-events-none fixed -top-32 left-1/2 -translate-x-1/2 h-[400px] sm:h-[600px] w-full sm:w-[1200px] -z-10 bg-radial-fade" />

      <Sidebar />

      <main
        className={cn(
          "transition-[padding] duration-300 ease-out px-4 sm:px-5 lg:px-6 pb-8",
          collapsed ? "lg:pl-[104px]" : "lg:pl-[288px]"
        )}
      >
        <Topbar />
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
