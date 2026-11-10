type ConsentCheckboxProps = {
  id: string;
  checked: boolean;
  description: string;
  error?: string;
  onChange: (checked: boolean) => void;
};

export function ConsentCheckbox({
  id,
  checked,
  description,
  error,
  onChange,
}: ConsentCheckboxProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-hint` : undefined}
          className="mt-0.5 size-5 shrink-0 rounded-sm accent-brand-primary"
        />
        <span className="text-sm text-text-primary">{description}</span>
      </label>
      {error && (
        <p id={`${id}-hint`} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
