import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse-soft rounded-md bg-foreground/5",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
