import { cn } from "@/lib/utils";
import {
  fieldErrorClass,
  fieldLabelClass,
  fieldVariants,
  type FieldState,
} from "./field-variants";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  ayuda?: string;
  state?: FieldState;
};

export function Textarea({
  className,
  id,
  label,
  ayuda,
  state,
  ...props
}: TextareaProps) {
  const errorId = state === "error" && ayuda ? `${id}-ayuda` : undefined;
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={state === "error"}
        aria-describedby={errorId}
        className={cn(fieldVariants({ state }), "min-h-24 py-2", className)}
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
