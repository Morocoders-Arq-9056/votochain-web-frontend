import { Notice } from "@/components/molecules/Notice";
import { AuditRow } from "@/components/molecules/AuditRow";
import type { TallyResult } from "@/lib/domain/voting/tally.vo";
import {
  TALLY_AUDIT_TITLE,
  TALLY_ONLY_CONFIRMED_DETAIL,
  TALLY_ONLY_CONFIRMED_TITLE,
} from "@/lib/ui/copy";

type TallyAuditPanelProps = {
  tally: TallyResult;
};

export function TallyAuditPanel({ tally }: TallyAuditPanelProps) {
  return (
    <div className="flex w-full flex-col gap-4 lg:max-w-[440px]">
      <Notice
        tone="info"
        title={TALLY_ONLY_CONFIRMED_TITLE}
        detail={TALLY_ONLY_CONFIRMED_DETAIL}
      />
      <section className="flex flex-col gap-2 rounded-card border border-border bg-surface p-[var(--panel-pad)] shadow-card">
        <h2 className="text-base font-semibold text-text-primary">{TALLY_AUDIT_TITLE}</h2>
        <p className="text-sm text-text-primary">Confirmados {tally.confirmed}</p>
        <p className="text-sm text-text-secondary">
          No se muestran opciones individuales ni vínculos entre persona y voto.
          Historial inmutable.
        </p>
        <AuditRow
          actor="Sistema"
          occurredAt="12/02/2026 · 18:05 PET (UTC-5)"
          reason="Conteo exclusivo de confirmados."
        />
      </section>
    </div>
  );
}
