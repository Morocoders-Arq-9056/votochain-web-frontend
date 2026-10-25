import { cn } from "@/lib/utils";

type RadioCardProps = {
  name: string;
  valor: string;
  etiqueta: string;
  descripcion?: string;
  seleccionada: boolean;
  onSeleccionar: (valor: string) => void;
};

export function RadioCard({
  name,
  valor,
  etiqueta,
  descripcion,
  seleccionada,
  onSeleccionar,
}: RadioCardProps) {
  return (
    <label
      className={cn(
        "flex min-h-14 cursor-pointer items-center gap-3 rounded-md border px-4 py-2",
        seleccionada ? "border-brand-primary bg-bg" : "border-border bg-surface",
      )}
    >
      <input
        type="radio"
        name={name}
        value={valor}
        checked={seleccionada}
        onChange={() => onSeleccionar(valor)}
        className="size-5 shrink-0 accent-brand-primary focus-visible:outline-2"
      />
      <span className="flex flex-col">
        <span className="text-base font-semibold text-text-primary">
          {etiqueta}
        </span>
        {descripcion && (
          <span className="text-sm text-text-secondary">{descripcion}</span>
        )}
      </span>
    </label>
  );
}
