import { Button } from "@/components/atoms/Button";
import { RadioCard } from "@/components/atoms/RadioCard";

export type VoteOption = {
  value: string;
  label: string;
  description?: string;
};

type VoteFormProps = {
  proposalTitle: string;
  frozenRule: string;
  voterSummary: string;
  authorizationCode: string;
  validUntil: string;
  options: VoteOption[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  onRequestSignature: () => void;
  signing?: boolean;
};

export function VoteForm({
  proposalTitle,
  frozenRule,
  voterSummary,
  authorizationCode,
  validUntil,
  options,
  selectedValue,
  onSelect,
  onRequestSignature,
  signing = false,
}: VoteFormProps) {
  const hasOption = Boolean(selectedValue);
  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex flex-col gap-1">
        <span className="text-sm text-text-secondary">
          Miembro / Condominio Los Olivos
        </span>
        <h1 className="font-display text-2xl text-text-primary">Emitir voto</h1>
        <span className="text-base text-text-primary">{proposalTitle}</span>
        <span className="text-sm text-text-secondary">{frozenRule}</span>
      </header>

      <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
        <span className="text-base font-semibold text-text-primary">
          {voterSummary}
        </span>
        <span className="text-sm text-text-secondary">
          Autorización {authorizationCode} · hasta {validUntil}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-base font-semibold text-text-primary">
          Seleccione una opción
        </span>
        <div role="radiogroup" className="flex flex-col gap-2">
          {options.map((option) => (
            <RadioCard
              key={option.value}
              name="vote-option"
              value={option.value}
              label={option.label}
              description={option.description}
              selected={selectedValue === option.value}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      <Button
        type="button"
        onClick={onRequestSignature}
        disabled={!hasOption}
        loading={signing}
      >
        Firmar y votar
      </Button>
      <p className="text-sm text-text-secondary">
        {hasOption
          ? "Revisará el contenido antes de autorizar la firma."
          : "Elija una opción para habilitar la firma. Aún no se ha firmado ni consumido la autorización."}
      </p>
      <p className="text-sm text-text-secondary">
        La firma requiere su autorización explícita. Se olvida inmediatamente.
        Solo Confirmado cuenta.
      </p>
    </section>
  );
}
