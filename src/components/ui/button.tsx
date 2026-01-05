"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ra-orange)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--ra-orange)] text-white hover:bg-[var(--ra-orange-dark)] shadow-lg shadow-[var(--ra-orange)]/20 hover:shadow-xl hover:shadow-[var(--ra-orange)]/30 hover:-translate-y-0.5",
        secondary:
          "bg-[var(--ra-slate-900)] text-white hover:bg-[var(--ra-slate-800)] shadow-lg hover:shadow-xl hover:-translate-y-0.5",
        outline:
          "border-2 border-[var(--ra-slate-900)] text-[var(--ra-slate-900)] hover:bg-[var(--ra-slate-900)] hover:text-white",
        ghost:
          "text-[var(--ra-slate-700)] hover:bg-[var(--ra-stone-100)] hover:text-[var(--ra-slate-900)]",
        link: "text-[var(--ra-orange)] underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
