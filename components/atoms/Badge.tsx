import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-xs font-semibold uppercase leading-[15px] tracking-wide",
  {
    variants: {
      tone: {
        success: "border-bg-success bg-bg-success text-success",
        warning: "border-bg-warning bg-bg-warning text-warning",
        danger: "border-bg-danger bg-bg-danger text-danger",
        neutral: "border-border bg-bg text-text-secondary",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  className,
  tone,
  children,
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ tone, className }))}>
      <span aria-hidden className="size-2 rounded-full bg-current" />
      {children}
    </span>
  );
}
