import { Badge } from "@/components/atoms/Badge";
import { StepDot } from "@/components/atoms/StepDot";
import type {
  ReceiptResult,
  ReceiptStep,
} from "@/lib/domain/voting/receipt.vo";

export type { ReceiptResult as ReceiptOutcome, ReceiptStep };

type VoteReceiptTimelineProps = {
  proposal: string;
  steps: ReceiptStep[];
  result: ReceiptResult;
};

export function VoteReceiptTimeline({
  proposal,
  steps,
  result,
}: VoteReceiptTimelineProps) {
  const confirmed = result.status === "CONFIRMED";
  return (
    <section className="flex w-full flex-col gap-4 rounded-lg border border-border bg-surface p-5">
      <header className="flex flex-col gap-1">
        <span className="text-sm text-text-secondary">Miembro / Mi recibo</span>
        <h1 className="font-display text-2xl text-text-primary">Mi recibo</h1>
        <span className="text-base text-text-secondary">{proposal}</span>
      </header>

      <div className="flex flex-col gap-2">
        {confirmed ? (
          <Badge tone="success">Confirmado</Badge>
        ) : result.retryable ? (
          <Badge tone="warning">Fallido · reintentando</Badge>
        ) : (
          <Badge tone="danger">Fallido</Badge>
        )}

        {confirmed ? (
          <div className="flex flex-col gap-1 rounded-md border border-border bg-bg-success p-4">
            <span className="text-base font-semibold text-success">
              Ya cuenta en el escrutinio
            </span>
            <span className="text-sm text-text-secondary">
              Confirmado en blockchain. Solo los votos confirmados cuentan.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-1 rounded-md border border-border bg-bg-danger p-4">
            <span className="text-base font-semibold text-danger">
              Aún no cuenta
            </span>
            <span className="text-sm text-text-secondary">{result.reason}</span>
            <span className="text-sm text-text-secondary">
              {result.retryable
                ? "Su voto firmado se conserva sin cambios. El sistema reintenta automáticamente. No hay reenvío manual."
                : "Su voto firmado se conserva sin cambios, pero no cuenta. No habrá más reintentos. Contacte soporte; no vuelva a votar con la misma autorización."}
            </span>
          </div>
        )}
      </div>

      <ol aria-live="polite" className="flex flex-col">
        {steps.map((step) => (
          <li key={step.key} className="flex gap-3 py-2">
            <StepDot status={step.status} />
            <span className="flex flex-col">
              <span className="text-base text-text-primary">
                {step.label}
                {step.status === "current" && " · estado actual"}
              </span>
              {step.dateTime && (
                <span className="text-sm text-text-secondary">
                  {step.dateTime}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>

      {confirmed && (
        <div className="flex flex-col gap-2">
          <details className="rounded-md border border-border bg-bg p-3">
            <summary className="cursor-pointer text-sm font-semibold text-text-primary">
              Código de constancia (hash al expandir)
            </summary>
            <code className="mt-2 block font-mono text-[13px] break-all text-text-secondary">
              {result.hash}
            </code>
          </details>
          {result.explorerUrl && (
            <a
              href={result.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-brand-primary"
            >
              Ver en explorador blockchain
            </a>
          )}
        </div>
      )}
    </section>
  );
}
