"use client";

import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { CameraGuide } from "@/components/atoms/CameraGuide";
import { ConsentCheckbox } from "@/components/atoms/ConsentCheckbox";
import { useState } from "react";
import { LIVENESS_CONSENT, LIVENESS_CONTINUE, LIVENESS_START } from "@/lib/ui/copy";

type LivenessPanelProps = {
  statusLabel: string;
  stepLabel: string;
  guide: string;
  serverError?: string | null;
  onStart: () => void;
  onConfirm: () => void;
};

export function LivenessPanel({
  statusLabel,
  stepLabel,
  guide,
  serverError,
  onStart,
  onConfirm,
}: LivenessPanelProps) {
  const [consent, setConsent] = useState(false);
  const [started, setStarted] = useState(false);
  return (
    <div className="flex w-full flex-col gap-4 rounded-card border border-border bg-surface p-5 shadow-card">
      <Badge tone="neutral">{statusLabel}</Badge>
      <p className="text-sm text-text-primary">{stepLabel}</p>
      <CameraGuide instruction={guide} />
      <ConsentCheckbox id="liveness-consent" checked={consent} description={LIVENESS_CONSENT} onChange={setConsent} />
      {serverError && (
        <p role="alert" className="text-sm text-danger">
          {serverError}
        </p>
      )}
      {!started ? (
        <Button
          type="button"
          disabled={!consent}
          onClick={() => {
            setStarted(true);
            onStart();
          }}
        >
          {LIVENESS_START}
        </Button>
      ) : (
        <Button type="button" disabled={!consent} onClick={onConfirm}>
          {LIVENESS_CONTINUE}
        </Button>
      )}
    </div>
  );
}
