import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-field px-6 text-base font-semibold transition-colors focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-white hover:bg-brand-deep active:bg-brand-deep",
        secondary:
          "border border-border bg-surface text-text-primary hover:border-border-strong hover:bg-surface-hover active:bg-surface-hover",
        danger: "bg-danger text-white hover:brightness-95 active:brightness-90",
        ghost:
          "text-text-primary hover:bg-surface-hover active:bg-surface-hover",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export function Button({
  className,
  variant,
  loading = false,
  disabled,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { loading?: boolean }) {
  return (
    <button
      className={cn(buttonVariants({ variant, className }))}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner size="sm" aria-hidden />}
      {children}
    </button>
  );
}
