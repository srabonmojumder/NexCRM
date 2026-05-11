import Link from "next/link";
import { Logo } from "@/components/common/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid-pattern opacity-[0.04] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 h-[800px] w-[1400px] -z-10 bg-radial-fade" />

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-10 flex-col">
        <Link href="/" className="z-10">
          <Logo size="md" priority />
        </Link>

        <div className="flex-1 flex items-center">
          <div className="relative z-10">
            <h2 className="font-display text-4xl font-bold tracking-tight leading-tight max-w-md">
              The CRM that <span className="gradient-text">moves at your speed</span>.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md leading-relaxed">
              Pipeline, analytics, messaging and revenue intelligence — designed for sales orgs that
              ship.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                ["12k+", "Active teams"],
                ["$2.4B", "Revenue tracked"],
                ["99.99%", "Uptime SLA"],
              ].map(([v, l]) => (
                <div key={l} className="glass rounded-xl p-3 text-center">
                  <p className="font-display text-lg font-bold">{v}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-1/4 -left-32 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute top-1/2 right-10 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />

        <p className="text-xs text-muted-foreground z-10">
          © 2026 NexCRM Inc. Crafted in Brooklyn, NY.
        </p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex lg:hidden items-center justify-between p-6">
          <Link href="/">
            <Logo size="sm" priority />
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
