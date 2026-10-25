import { cn } from "@/lib/utils";

type RadioCardProps = {
  name: string;
  value: string;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: (value: string) => void;
};

export function RadioCard({
  name,
  value,
  label,
  description,
  selected,
  onSelect,
}: RadioCardProps) {
  return (
    <label
      className={cn(
        "flex min-h-14 cursor-pointer items-center gap-3 rounded-md border px-4 py-2",
        selected ? "border-brand-primary bg-bg" : "border-border bg-surface",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
        className="size-5 shrink-0 accent-brand-primary focus-visible:outline-2"
      />
      <span className="flex flex-col">
        <span className="text-base font-semibold text-text-primary">
          {label}
        </span>
        {description && (
          <span className="text-sm text-text-secondary">{description}</span>
        )}
      </span>
    </label>
  );
}
