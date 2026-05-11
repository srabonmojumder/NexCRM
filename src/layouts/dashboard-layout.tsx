"use client";

import { motion } from "framer-motion";
import { useUIStore } from "@/store/ui-store";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid-pattern opacity-[0.04] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <div className="pointer-events-none fixed -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[1200px] -z-10 bg-radial-fade" />

      <Sidebar />

      <main
        className={cn(
          "transition-[padding] duration-300 ease-out px-4 lg:px-6 pb-8",
          collapsed ? "lg:pl-[104px]" : "lg:pl-[288px]"
        )}
      >
        <Topbar />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
