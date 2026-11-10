import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { AuditRow } from "@/components/molecules/AuditRow";

type VerificationStatusPanelProps = {
  statusTone: "success" | "warning" | "danger" | "neutral";
  statusLabel: string;
  detail: string;
  actionLabel: string;
  onAction: () => void;
  history: { actor: string; occurredAt: string; reason: string }[];
};

export function VerificationStatusPanel({
  statusTone,
  statusLabel,
  detail,
  actionLabel,
  onAction,
  history,
}: VerificationStatusPanelProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
      <section className="flex flex-col gap-3 rounded-card border border-border bg-surface p-5 shadow-card">
        <Badge tone={statusTone}>{statusLabel}</Badge>
        <p className="text-sm text-text-secondary">{detail}</p>
        <Button type="button" onClick={onAction}>
          {actionLabel}
        </Button>
      </section>
      <section className="flex flex-col rounded-card border border-border bg-surface p-5 shadow-card">
        <div className="flex flex-col divide-y divide-border">
          {history.map((h, i) => (
            <AuditRow key={i} actor={h.actor} occurredAt={h.occurredAt} reason={h.reason} />
          ))}
        </div>
      </section>
    </div>
  );
}
