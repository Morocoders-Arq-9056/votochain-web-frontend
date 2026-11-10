"use client";

import { useState } from "react";
import { VotingTemplate } from "@/components/templates/VotingTemplate";
import { TallyPanel } from "@/components/organisms/TallyPanel";
import { TallyAuditPanel } from "@/components/organisms/TallyAuditPanel";
import { CloseProposalDialog } from "@/components/organisms/CloseProposalDialog";
import type { TallyResult } from "@/lib/domain/voting/tally.vo";
import {
  NAV_ADMIN_COMMUNITY,
  NAV_ADMIN_PADRON,
  NAV_ADMIN_PANEL,
  NAV_ADMIN_PROPOSALS,
  TALLY_CLOSED,
  TALLY_TITLE,
} from "@/lib/ui/copy";
import { routes } from "@/lib/ui/routes";
import { closeProposal } from "./actions";

type CloseFlowProps = {
  proposalId: string;
  initialTally: TallyResult;
};

export function CloseFlow({ proposalId, initialTally }: CloseFlowProps) {
  const [step, setStep] = useState<"STEP_1" | "STEP_2" | "CLOSED">("STEP_1");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <VotingTemplate
      eyebrow="Administrador / Condominio Los Olivos"
      title={TALLY_TITLE}
      subtitle={initialTally.proposalTitle}
      sidebarLabel="Administrador"
      sidebarItems={[
        { href: routes.home(), label: NAV_ADMIN_PANEL },
        { href: routes.padron(), label: NAV_ADMIN_PADRON },
        { href: routes.propuesta("demo"), label: NAV_ADMIN_PROPOSALS },
        { href: routes.cierre("demo"), label: NAV_ADMIN_COMMUNITY, active: true },
      ]}
      actorLine="Condominio Los Olivos · Rosa Salazar"
    >
      {notice && (
        <p role="status" className="text-sm text-success">
          {notice}
        </p>
      )}
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[672px_440px]">
        <TallyPanel tally={initialTally} />
        <TallyAuditPanel tally={initialTally} />
      </div>
      {step === "CLOSED" ? (
        <p role="status" className="text-sm text-text-primary">
          {TALLY_CLOSED}
        </p>
      ) : (
        <CloseProposalDialog
          step={step}
          pending={pending}
          serverError={error}
          onCancel={() => setStep("STEP_1")}
          onClose={async (input) => {
            setPending(true);
            setError(null);
            const outcome = await closeProposal({ proposalId, ...input });
            setPending(false);
            if (outcome.ok) {
              if (outcome.step === "STEP_1") {
                setStep("STEP_2");
              } else {
                setStep("CLOSED");
                setNotice(TALLY_CLOSED);
              }
            } else {
              setError("No pudimos cerrar la propuesta. Revise el motivo.");
            }
          }}
        />
      )}
    </VotingTemplate>
  );
}
