import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import type { AuthorizationOutcome } from "@/lib/domain/voting/vote-authorization.vo";
import type { ChecklistCriterion } from "@/lib/ui/checklist";

type VoteAuthorizationChecklistProps = {
  proposal: string;
  criteria: ChecklistCriterion[];
  outcome: AuthorizationOutcome;
  onVoteNow?: () => void;
  onStartLiveness?: () => void;
  onRequestAgain?: () => void;
};

export function VoteAuthorizationChecklist({
  proposal,
  criteria,
  outcome,
  onVoteNow,
  onStartLiveness,
  onRequestAgain,
}: VoteAuthorizationChecklistProps) {
  const authorized = outcome.kind === "AUTHORIZED";
  const expired = outcome.kind === "EXPIRED";
  const missingBiometrics = criteria.some(
    (criterion) => criterion.id === "biometrics" && !criterion.met,
  );

  return (
    <section className="flex w-full flex-col gap-4 rounded-lg border border-border bg-surface p-5">
      <header className="flex flex-col gap-1">
        <h2 className="font-display text-xl text-text-primary">
          Autorización
        </h2>
        <span className="text-base text-text-secondary">{proposal}</span>
      </header>

      <div className="flex flex-col gap-4">
        {criteria.map((criterion) => (
          <div key={criterion.id} className="flex w-full flex-col gap-2">
            <span className="text-base text-text-primary">
              {criterion.question}
            </span>
            <Badge tone={criterion.tone}>{criterion.status}</Badge>
          </div>
        ))}
      </div>

      {authorized && (
        <div className="flex flex-col gap-2">
          <Badge tone="success">Autorizada</Badge>
          <p className="text-base text-text-primary">
            Autorización de un solo uso {outcome.authorization.code}, válida
            hasta {outcome.authorization.validUntil}.
          </p>
          <p className="text-sm text-text-secondary">
            Al emitirla se congelaron su elegibilidad y el veredicto biométrico.
            Los cambios posteriores no reescriben esta autorización.
          </p>
        </div>
      )}

      {outcome.kind === "DENIED" && (
        <div className="flex flex-col gap-2">
          <Badge tone="danger">Denegada</Badge>
          <p className="text-base text-text-primary">
            No puede votar en esta propuesta
          </p>
          <p className="text-sm text-text-secondary">{outcome.reason}</p>
        </div>
      )}

      {expired && (
        <div className="flex flex-col gap-2">
          <Badge tone="neutral">Expirada</Badge>
          <p className="text-base text-text-primary">La autorización venció</p>
          <p className="text-sm text-text-secondary">
            Para votar, solicite una nueva autorización desde el detalle de la
            propuesta.
          </p>
        </div>
      )}

      <div className="form-actions">
        {authorized && (
          <Button type="button" onClick={onVoteNow}>
            Votar ahora
          </Button>
        )}
        {missingBiometrics && (
          <Button type="button" variant="secondary" onClick={onStartLiveness}>
            Ir a prueba de vida
          </Button>
        )}
        {expired && (
          <Button type="button" onClick={onRequestAgain}>
            Pedir de nuevo
          </Button>
        )}
      </div>
    </section>
  );
}
