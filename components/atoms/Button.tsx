import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 text-base font-semibold transition-colors focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary text-white",
        secondary: "border border-border bg-surface text-text-primary",
        danger: "bg-danger text-white",
        ghost: "text-text-primary",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export function Button({
  className,
  variant,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>) {
  return (
    <button className={cn(buttonVariants({ variant, className }))} {...props} />
  );
}
