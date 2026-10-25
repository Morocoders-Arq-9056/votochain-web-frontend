import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";

export type CriterionTone = "success" | "warning" | "danger" | "neutral";

export type ChecklistCriterion = {
  question: string;
  met: boolean;
  status: string;
  tone: CriterionTone;
};

export type AuthorizationResult =
  | { status: "AUTHORIZED"; code: string; validUntil: string }
  | { status: "DENIED"; reason: string }
  | { status: "EXPIRED" };

type VoteAuthorizationChecklistProps = {
  proposal: string;
  membership: ChecklistCriterion;
  biometrics: ChecklistCriterion;
  result: AuthorizationResult;
  onVoteNow?: () => void;
  onStartLiveness?: () => void;
  onRequestAgain?: () => void;
};

function Criterion({ criterion }: { criterion: ChecklistCriterion }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-base text-text-primary">{criterion.question}</span>
      <Badge tone={criterion.tone}>{criterion.status}</Badge>
    </div>
  );
}

export function VoteAuthorizationChecklist({
  proposal,
  membership,
  biometrics,
  result,
  onVoteNow,
  onStartLiveness,
  onRequestAgain,
}: VoteAuthorizationChecklistProps) {
  const authorized = result.status === "AUTHORIZED";
  const expired = result.status === "EXPIRED";
  const missingBiometrics = !biometrics.met;

  return (
    <section className="flex w-full flex-col gap-4 rounded-lg border border-border bg-surface p-5">
      <header className="flex flex-col gap-1">
        <h2 className="font-display text-xl text-text-primary">
          Autorización
        </h2>
        <span className="text-base text-text-secondary">{proposal}</span>
      </header>

      <div className="flex flex-col gap-4">
        <Criterion criterion={membership} />
        <Criterion criterion={biometrics} />
      </div>

      {authorized && (
        <div className="flex flex-col gap-2">
          <Badge tone="success">Autorizada</Badge>
          <p className="text-base text-text-primary">
            Autorización de un solo uso {result.code}, válida hasta{" "}
            {result.validUntil}.
          </p>
          <p className="text-sm text-text-secondary">
            Al emitirla se congelaron su elegibilidad y el veredicto biométrico.
            Los cambios posteriores no reescriben esta autorización.
          </p>
        </div>
      )}

      {result.status === "DENIED" && (
        <div className="flex flex-col gap-2">
          <Badge tone="danger">Denegada</Badge>
          <p className="text-base text-text-primary">
            No puede votar en esta propuesta
          </p>
          <p className="text-sm text-text-secondary">{result.reason}</p>
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
