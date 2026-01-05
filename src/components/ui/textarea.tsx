import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border bg-white px-4 py-3 text-base transition-colors resize-none",
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
Textarea.displayName = "Textarea";

export { Textarea };
