import { Badge } from "@/components/atoms/Badge";
import type { TallyResult } from "@/lib/domain/voting/tally.vo";
import { participationPercent } from "@/lib/domain/voting/tally.vo";

type TallyPanelProps = {
  tally: TallyResult;
};

export function TallyPanel({ tally }: TallyPanelProps) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-card border border-border bg-surface p-[var(--panel-pad)] shadow-card lg:max-w-[672px]">
      <h2 className="text-base font-semibold text-text-primary">{tally.proposalTitle}</h2>
      <Badge tone={tally.quorumReached ? "success" : "warning"}>
        {tally.quorumReached ? "Quórum alcanzado" : "Sin quórum"}
      </Badge>
      <ul className="flex flex-col gap-4">
        {tally.options.map((option) => (
          <li key={option.value} className="flex flex-col gap-2">
            <p className="flex items-baseline justify-between text-sm">
              <span className="font-semibold text-text-primary">{option.label}</span>
              <span className="text-text-secondary">
                {option.count} · {option.percent.toFixed(2).replace(".", ",")}%
              </span>
            </p>
            <span
              role="img"
              aria-label={`${option.label} ${option.percent}%`}
              className="h-2 w-full overflow-hidden rounded-full bg-bg"
            >
              <span
                className="block h-full rounded-full bg-brand-primary"
                style={{ width: `${Math.min(100, option.percent)}%` }}
              />
            </span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-text-secondary">
        {tally.confirmed}/{tally.eligible} activos ·{" "}
        {participationPercent(tally.confirmed, tally.eligible).toFixed(0)}%
      </p>
      <p className="text-sm text-text-secondary">Regla aplicada: {tally.frozenRule}</p>
    </section>
  );
}
