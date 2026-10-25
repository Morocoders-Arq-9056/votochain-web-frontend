import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldErrorClass, fieldLabelClass, fieldVariants, type FieldState } from "./field-variants";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  ayuda?: string;
  state?: FieldState;
};

export function Select({
  className,
  id,
  label,
  ayuda,
  state,
  children,
  ...props
}: SelectProps) {
  const errorId = state === "error" && ayuda ? `${id}-ayuda` : undefined;
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          aria-invalid={state === "error"}
          aria-describedby={errorId}
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
      {errorId && (
        <p id={errorId} role="alert" className={fieldErrorClass}>
          {ayuda}
        </p>
      )}
    </div>
  );
}
