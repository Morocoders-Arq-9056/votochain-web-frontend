import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "min-h-12 w-full rounded-md border bg-surface p-3 text-base text-text-primary outline-none transition-colors placeholder:text-text-secondary focus-visible:outline-2 focus-visible:outline-brand-primary disabled:pointer-events-none disabled:bg-bg disabled:opacity-50",
  {
    variants: { state: { default: "border-border", error: "border-danger" } },
    defaultVariants: { state: "default" },
  },
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & { label: string; ayuda?: string };

export function Input({ className, id, label, ayuda, state, ...props }: InputProps) {
  const ayudaId = state === "error" && ayuda ? `${id}-ayuda` : undefined;
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-text-primary">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={state === "error"}
        aria-describedby={ayudaId}
        className={cn(inputVariants({ state, className }))}
        {...props}
      />
      {ayudaId && (
        <p id={ayudaId} role="alert" className="text-sm text-danger">
          {ayuda}
        </p>
      )}
    </div>
  );
}
