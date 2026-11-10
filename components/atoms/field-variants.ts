import { cva, type VariantProps } from "class-variance-authority";

export const fieldVariants = cva(
  "h-12 w-full rounded-field border bg-surface px-4 text-base text-text-primary transition-colors placeholder:text-placeholder focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:pointer-events-none disabled:bg-bg disabled:opacity-50",
  {
    variants: { state: { default: "border-border", error: "border-danger" } },
    defaultVariants: { state: "default" },
  },
);

export type FieldState = NonNullable<VariantProps<typeof fieldVariants>["state"]>;

export const fieldLabelClass = "text-sm font-semibold text-text-primary";

export const fieldErrorClass = "text-sm text-danger";
