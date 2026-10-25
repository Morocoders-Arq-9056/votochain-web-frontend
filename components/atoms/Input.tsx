import { cn } from "@/lib/utils";
import {
  fieldErrorClass,
  fieldLabelClass,
  fieldVariants,
  type FieldState,
} from "./field-variants";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  state?: FieldState;
};

export function Input({ className, id, label, hint, state, ...props }: InputProps) {
  const hintId = state === "error" && hint ? `${id}-hint` : undefined;
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={state === "error"}
        aria-describedby={hintId}
        className={cn(fieldVariants({ state, className }))}
        {...props}
      />
      {hintId && (
        <p id={hintId} role="alert" className={fieldErrorClass}>
          {hint}
        </p>
      )}
    </div>
  );
}
