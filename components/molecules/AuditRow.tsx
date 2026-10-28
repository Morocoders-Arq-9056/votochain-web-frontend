import { History } from "lucide-react";

type AuditRowProps = {
  /** Who performed the change. */
  actor: string;
  /** When it happened, already formatted for es-PE. */
  occurredAt: string;
  /** Why it happened. */
  reason: string;
};

/**
 * Read-only traceability row: who, when, why. It never offers an edit action
 * — history is immutable.
 */
export function AuditRow({ actor, occurredAt, reason }: AuditRowProps) {
  return (
    <div className="flex w-full items-start gap-3 rounded-md border border-border bg-surface p-4">
      <History aria-hidden className="mt-0.5 size-5 shrink-0 text-text-secondary" />
      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold text-text-primary">{actor}</span>
        <span className="text-sm text-text-secondary">{occurredAt}</span>
        <span className="text-sm text-text-secondary">{reason}</span>
      </div>
    </div>
  );
}
