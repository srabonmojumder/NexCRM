import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground transition-[border-color,box-shadow,background-color] duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium hover:border-foreground/20 focus-visible:outline-none focus-visible:border-primary/60 focus-visible:bg-background focus-visible:ring-4 focus-visible:ring-primary/12 disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-10",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
