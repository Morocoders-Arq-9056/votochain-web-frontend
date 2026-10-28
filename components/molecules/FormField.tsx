import { Input } from "@/components/atoms/Input";

type FormFieldProps = {
  id: string;
  label: string;
  value?: string;
  hint?: string;
  state?: "default" | "error";
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  onChange?: (value: string) => void;
};

/**
 * Label + control + error message as one interaction. The error text is
 * friendly Spanish (es-PE) and never a technical code.
 */
export function FormField({
  id,
  label,
  value,
  hint,
  state = "default",
  type = "text",
  onChange,
}: FormFieldProps) {
  return (
    <Input
      id={id}
      label={label}
      type={type}
      value={value}
      hint={hint}
      state={state}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}
