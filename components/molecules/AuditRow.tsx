type AuditRowProps = {
  /** Event title, rendered in semibold. */
  actor: string;
  /** When it happened, already formatted for es-PE. */
  occurredAt: string;
  /** Detail line. */
  reason: string;
};

/**
 * Read-only traceability row: title, when/who, detail. Rows are separated
 * by dividers in the parent (`divide-y`) — never cards. History is immutable.
 */
export function AuditRow({ actor, occurredAt, reason }: AuditRowProps) {
  return (
    <div className="flex w-full flex-col gap-1 py-3 first:pt-0 last:pb-0">
      <span className="text-sm font-semibold text-text-primary">{actor}</span>
      <span className="text-xs text-text-secondary">{occurredAt}</span>
      <span className="text-sm text-text-secondary">{reason}</span>
    </div>
  );
}
