import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: { size: { sm: "size-4", md: "size-6" } },
    defaultVariants: { size: "md" },
  },
);

export function Spinner({
  className,
  size,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof spinnerVariants>) {
  return (
    <span role="status" className={cn(spinnerVariants({ size, className }))} {...props} />
  );
}
