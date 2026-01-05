import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border bg-white px-4 py-3 text-base transition-colors",
          "border-[var(--ra-stone-200)] text-[var(--ra-slate-900)]",
          "placeholder:text-[var(--ra-stone-400)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--ra-orange)] focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--ra-stone-50)]",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
