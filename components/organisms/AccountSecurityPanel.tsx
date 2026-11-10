"use client";

import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { AuditRow } from "@/components/molecules/AuditRow";
import {
  ACCOUNT_ACTIONS_TITLE,
  ACCOUNT_ACTIVE_BADGE,
  ACCOUNT_CHANGE_EMAIL,
  ACCOUNT_CHANGE_PASSWORD,
  ACCOUNT_EMAIL_LABEL,
  ACCOUNT_EXTERNAL_LABEL,
  ACCOUNT_EXTERNAL_VALUE,
  ACCOUNT_GOOGLE_LINK,
  ACCOUNT_HISTORY_TITLE,
  ACCOUNT_NO_HISTORY,
  ACCOUNT_PANEL_TITLE,
  ACCOUNT_ROLES_LABEL,
  ACCOUNT_ROLES_VALUE,
  ACCOUNT_SIGN_OUT,
  ACCOUNT_VERIFIED_BADGE,
} from "@/lib/ui/copy";

type AccountHistoryEntry = {
  actor: string;
  occurredAt: string;
  reason: string;
};

type AccountSecurityPanelProps = {
  email: string;
  verified: boolean;
  history: AccountHistoryEntry[];
  notice?: string | null;
  onAction: (action: "password" | "email" | "google" | "signout") => void;
};

export function AccountSecurityPanel({
  email,
  verified,
  history,
  notice,
  onAction,
}: AccountSecurityPanelProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
      <section className="flex flex-col gap-3 rounded-card border border-border bg-surface p-[var(--panel-pad)] shadow-card">
        <h2 className="text-base font-semibold text-text-primary">{ACCOUNT_PANEL_TITLE}</h2>
        <div className="flex flex-wrap gap-2">
          <Badge tone="success">{ACCOUNT_ACTIVE_BADGE}</Badge>
          <Badge tone={verified ? "success" : "warning"}>
            {ACCOUNT_VERIFIED_BADGE}
          </Badge>
        </div>
        <dl className="flex flex-col gap-3">
          <div>
            <dt className="text-xs text-text-secondary">{ACCOUNT_EMAIL_LABEL}</dt>
            <dd className="text-sm font-semibold text-text-primary">{email}</dd>
          </div>
          <div>
            <dt className="text-xs text-text-secondary">{ACCOUNT_ROLES_LABEL}</dt>
            <dd className="text-sm font-semibold text-text-primary">
              {ACCOUNT_ROLES_VALUE}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-text-secondary">{ACCOUNT_EXTERNAL_LABEL}</dt>
            <dd className="text-sm font-semibold text-text-primary">
              {ACCOUNT_EXTERNAL_VALUE}
            </dd>
          </div>
        </dl>
      </section>
      <section className="flex flex-col gap-4 rounded-card border border-border bg-surface p-[var(--panel-pad)] shadow-card">
        <h2 className="text-base font-semibold text-text-primary">{ACCOUNT_ACTIONS_TITLE}</h2>
        <div className="flex flex-col gap-4">
          <Button type="button" variant="secondary" onClick={() => onAction("password")}>
            {ACCOUNT_CHANGE_PASSWORD}
          </Button>
          <Button type="button" variant="secondary" onClick={() => onAction("email")}>
            {ACCOUNT_CHANGE_EMAIL}
          </Button>
          <Button type="button" variant="secondary" onClick={() => onAction("google")}>
            {ACCOUNT_GOOGLE_LINK}
          </Button>
          <Button type="button" variant="ghost" onClick={() => onAction("signout")}>
            {ACCOUNT_SIGN_OUT}
          </Button>
        </div>
        {notice && (
          <p role="status" className="text-sm text-success">
            {notice}
          </p>
        )}
      </section>
      <section className="flex flex-col gap-2 rounded-card border border-border bg-surface p-[var(--panel-pad)] shadow-card">
        <h2 className="text-base font-semibold text-text-primary">{ACCOUNT_HISTORY_TITLE}</h2>
        {history.length === 0 ? (
          <p className="text-sm text-text-secondary">{ACCOUNT_NO_HISTORY}</p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {history.map((h, i) => (
              <AuditRow
                key={i}
                actor={h.actor}
                occurredAt={h.occurredAt}
                reason={h.reason}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
