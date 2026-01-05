import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--ra-orange)]/10 text-[var(--ra-orange)]",
        secondary: "bg-[var(--ra-stone-100)] text-[var(--ra-slate-700)]",
        success: "bg-[var(--ra-emerald)]/10 text-[var(--ra-emerald)]",
        outline: "border border-[var(--ra-stone-200)] text-[var(--ra-slate-700)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
