import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg" | "xl";

interface LogoProps {
  className?: string;
  size?: LogoSize;
  priority?: boolean;
}

const fullSize: Record<LogoSize, { w: number; h: number; cls: string }> = {
  sm: { w: 240, h: 160, cls: "h-10 w-auto" },
  md: { w: 360, h: 240, cls: "h-12 w-auto" },
  lg: { w: 480, h: 320, cls: "h-16 w-auto" },
  xl: { w: 640, h: 426, cls: "h-24 w-auto" },
};

const markSize: Record<LogoSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-14 w-14",
};

export function Logo({ className, size = "md", priority = false }: LogoProps) {
  const s = fullSize[size];
  return (
    <Image
      src="/image/logo/main_logo.png"
      alt="NexCRM — Smart Relationship Management"
      width={s.w}
      height={s.h}
      priority={priority}
      className={cn(s.cls, "select-none object-contain", className)}
    />
  );
}

export function LogoMark({
  className,
  size = "md",
  priority = false,
}: LogoProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-xl overflow-hidden",
        "bg-gradient-to-br from-[#0c1230] via-[#0a0e22] to-[#0a0e22]",
        "ring-1 ring-white/10",
        markSize[size],
        className
      )}
    >
      <Image
        src="/image/logo/sub_logo.png"
        alt="NexCRM"
        width={240}
        height={240}
        priority={priority}
        className="h-full w-full object-cover scale-[2.4] select-none pointer-events-none"
        style={{ objectPosition: "50% 22%" }}
      />
      <div
        aria-hidden
        className="absolute -inset-1 -z-10 rounded-2xl bg-brand-gradient blur-md opacity-35"
      />
    </div>
  );
}
