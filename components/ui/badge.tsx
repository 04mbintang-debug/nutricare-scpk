import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-teal-700 text-white",
        secondary: "border-transparent bg-teal-100 text-teal-800",
        outline: "border-slate-200 text-slate-700",
        gold: "border-amber-300 bg-amber-100 text-amber-900",
        silver: "border-slate-300 bg-slate-100 text-slate-700",
        bronze: "border-orange-300 bg-orange-100 text-orange-900",
        cost: "border-rose-200 bg-rose-50 text-rose-700",
        benefit: "border-emerald-200 bg-emerald-50 text-emerald-700",
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
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
