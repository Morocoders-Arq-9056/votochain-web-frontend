import { Badge } from "@/components/atoms/Badge";
import { Disclosure } from "@/components/atoms/Disclosure";
import { ExternalLink } from "@/components/atoms/ExternalLink";
import { StepDot } from "@/components/atoms/StepDot";
import type { VoterReceipt } from "@/lib/domain/voting/voter-receipt.vo";
import { RECORD_LABEL } from "@/lib/ui/copy";
import { timelineSteps } from "@/lib/ui/timeline";

type VoteReceiptTimelineProps = {
  proposal: string;
  receipt: VoterReceipt;
  explorerUrl?: string;
};

export function VoteReceiptTimeline({
  proposal,
  receipt,
  explorerUrl,
}: VoteReceiptTimelineProps) {
  const confirmed = receipt.status === "CONFIRMED";
  const steps = timelineSteps(receipt);

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
        ) : receipt.status === "FAILED" ? (
          <Badge tone="danger">Fallido</Badge>
        ) : (
          <Badge tone="warning">En curso</Badge>
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
        ) : receipt.status === "FAILED" ? (
          <div className="flex flex-col gap-1 rounded-md border border-border bg-bg-danger p-4">
            <span className="text-base font-semibold text-danger">
              Aún no cuenta
            </span>
            <span className="text-sm text-text-secondary">
              Su voto firmado se conserva sin cambios. El sistema reintenta
              automáticamente hasta 3 veces. Si se agota el límite, contacte
              soporte; no vuelva a votar con la misma autorización.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-1 rounded-md border border-border bg-bg-warning p-4">
            <span className="text-base font-semibold text-warning">
              Su voto firmado aún no cuenta
            </span>
            <span className="text-sm text-text-secondary">
              Su intención se firmó y está en cola de envío. Solo Confirmado
              en blockchain cuenta.
            </span>
          </div>
        )}
      </div>

      <ol aria-live="polite" className="flex flex-col">
        {steps.map((step) => (
          <li key={step.key} className="flex gap-3 py-2">
            <StepDot status={step.visual} />
            <span className="flex flex-col">
              <span className="text-base text-text-primary">
                {step.label}
                {step.visual === "current" && " · estado actual"}
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

      {confirmed && receipt.txHash && (
        <div className="flex flex-col gap-2">
          <Disclosure summary={RECORD_LABEL}>
            <code className="block font-mono text-code break-all text-text-secondary">
              {receipt.txHash}
            </code>
          </Disclosure>
          {explorerUrl && (
            <ExternalLink href={explorerUrl}>
              Ver en explorador blockchain
            </ExternalLink>
          )}
        </div>
      )}
    </section>
  );
}
