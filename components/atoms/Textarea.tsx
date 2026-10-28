import { cn } from "@/lib/utils";
import {
  fieldErrorClass,
  fieldLabelClass,
  fieldVariants,
  type FieldState,
} from "./field-variants";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  state?: FieldState;
};

export function Textarea({
  className,
  id,
  label,
  hint,
  state,
  ...props
}: TextareaProps) {
  const hintId = state === "error" && hint ? `${id}-hint` : undefined;
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={state === "error"}
        aria-describedby={hintId}
        className={cn(fieldVariants({ state }), "min-h-24 py-2", className)}
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
