import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Notice } from "@/components/molecules/Notice";
import { AuditRow } from "@/components/molecules/AuditRow";
import { DOCUMENT_CONTINUE } from "@/lib/ui/copy";

type DocumentResultPanelProps = {
  statusTone: "success" | "warning" | "danger" | "neutral";
  statusLabel: string;
  lines: string[];
  noticeTitle: string;
  noticeDetail: string;
  noticeTone: "info" | "success" | "warning" | "danger";
  history: { actor: string; occurredAt: string; reason: string }[];
  onContinue: () => void;
};

export function DocumentResultPanel({
  statusTone,
  statusLabel,
  lines,
  noticeTitle,
  noticeDetail,
  noticeTone,
  history,
  onContinue,
}: DocumentResultPanelProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
      <section className="flex flex-col gap-3 rounded-card border border-border bg-surface p-5 shadow-card">
        <Badge tone={statusTone}>{statusLabel}</Badge>
        {lines.map((l, i) => (
          <p key={i} className="text-sm text-text-primary">
            {l}
          </p>
        ))}
        <Notice tone={noticeTone} title={noticeTitle} detail={noticeDetail} />
        <Button type="button" onClick={onContinue}>
          {DOCUMENT_CONTINUE}
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
