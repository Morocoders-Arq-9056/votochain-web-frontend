"use client";

import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { CameraGuide } from "@/components/atoms/CameraGuide";
import { BIOMETRIC_CAPTURE, BIOMETRIC_PRIVACY, BIOMETRIC_RETRY } from "@/lib/ui/copy";

type BiometricEnrollPanelProps = {
  statusLabel: string;
  guide: string;
  captured: boolean;
  processing: boolean;
  onCapture: () => void;
  onRetry: () => void;
  onContinue: () => void;
  continueLabel: string;
};

export function BiometricEnrollPanel({
  statusLabel,
  guide,
  captured,
  processing,
  onCapture,
  onRetry,
  onContinue,
  continueLabel,
}: BiometricEnrollPanelProps) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-card border border-border bg-surface p-5 shadow-card">
      <Badge tone={captured ? "success" : "neutral"}>{statusLabel}</Badge>
      <CameraGuide instruction={guide} />
      <p className="text-sm text-text-secondary">{BIOMETRIC_PRIVACY}</p>
      {!captured ? (
        <Button type="button" onClick={onCapture} loading={processing}>
          {BIOMETRIC_CAPTURE}
        </Button>
      ) : (
        <>
          <Button type="button" variant="secondary" onClick={onRetry}>
            {BIOMETRIC_RETRY}
          </Button>
          <Button type="button" onClick={onContinue}>
            {continueLabel}
          </Button>
        </>
      )}
    </div>
  );
}
