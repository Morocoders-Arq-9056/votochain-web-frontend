import { cn } from "@/lib/utils";
import {
  fieldErrorClass,
  fieldLabelClass,
  fieldVariants,
  type FieldState,
} from "./field-variants";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  ayuda?: string;
  state?: FieldState;
};

export function Input({ className, id, label, ayuda, state, ...props }: InputProps) {
  const errorId = state === "error" && ayuda ? `${id}-ayuda` : undefined;
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={state === "error"}
        aria-describedby={errorId}
        className={cn(fieldVariants({ state, className }))}
        {...props}
      />
      {errorId && (
        <p id={errorId} role="alert" className={fieldErrorClass}>
          {ayuda}
        </p>
      )}
    </div>
  );
}
