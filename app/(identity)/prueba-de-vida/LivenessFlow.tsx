"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IdentityTemplate } from "@/components/templates/IdentityTemplate";
import { AccessContext } from "@/components/molecules/AccessContext";
import { LivenessPanel } from "@/components/organisms/LivenessPanel";
import { confirmLivenessAttempt, startLivenessAttempt } from "./actions";
import { identityNav } from "@/components/organisms/identityNav";
import {
  LIVENESS_DESCRIPTION,
  LIVENESS_LOOK,
  LIVENESS_NOT_VERIFIED,
  LIVENESS_TITLE,
  LIVENESS_VERIFIED,
} from "@/lib/ui/copy";
import { routes } from "@/lib/ui/routes";

export function LivenessFlow() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  return (
    <IdentityTemplate
      title={LIVENESS_TITLE}
      description={LIVENESS_DESCRIPTION}
      nav={identityNav("identity")}
    >
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,600px)_minmax(0,560px)] lg:gap-[var(--spacing-auth-gap)]">
        <div className="hidden lg:block">
          <AccessContext />
        </div>
        <div className="flex flex-col gap-4">
          <LivenessPanel
            statusLabel="Prueba en curso"
            stepLabel={LIVENESS_LOOK}
            guide={LIVENESS_LOOK}
            serverError={error}
            onStart={async () => {
              setError(null);
              try {
                const started = await startLivenessAttempt();
                setAttemptId(started.attemptId);
              } catch {
                setError(LIVENESS_NOT_VERIFIED);
              }
            }}
            onConfirm={async () => {
              if (!attemptId) {
                setError(LIVENESS_NOT_VERIFIED);
                return;
              }
              const outcome = await confirmLivenessAttempt(attemptId);
              if (outcome.status === "VERIFIED") {
                router.push(`${routes.miVerificacion()}?fresh=1`);
              } else {
                setError(LIVENESS_NOT_VERIFIED);
              }
            }}
          />
          <p role="status" className="text-sm text-text-secondary">
            {LIVENESS_VERIFIED}
          </p>
        </div>
      </div>
    </IdentityTemplate>
  );
}
