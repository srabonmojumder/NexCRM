"use client";

import { useEffect } from "react";
import { readSidebarCookie, useUIStore } from "@/store/ui-store";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The app is statically hosted (Firebase), so there is no server to read the
  // persisted cookie during render. Apply it once after mount — the prerendered
  // HTML uses the expanded default, avoiding any hydration mismatch.
  useEffect(() => {
    const collapsed = readSidebarCookie();
    if (collapsed) useUIStore.setState({ sidebarCollapsed: true });
  }, []);

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
