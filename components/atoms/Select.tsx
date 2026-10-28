import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldErrorClass, fieldLabelClass, fieldVariants, type FieldState } from "./field-variants";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  state?: FieldState;
};

export function Select({
  className,
  id,
  label,
  hint,
  state,
  children,
  ...props
}: SelectProps) {
  const hintId = state === "error" && hint ? `${id}-hint` : undefined;
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          aria-invalid={state === "error"}
          aria-describedby={hintId}
          className={cn(fieldVariants({ state }), "appearance-none pr-10", className)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-text-secondary"
        />
      </div>
      {hintId && (
        <p id={hintId} role="alert" className={fieldErrorClass}>
          {hint}
        </p>
      )}
    </div>
  );
}
