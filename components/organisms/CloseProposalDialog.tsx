"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import type { CloseStep } from "@/lib/domain/voting/close-proposal.vo";
import {
  TALLY_CLOSE_CANCEL,
  TALLY_CLOSE_CONFIRM,
  TALLY_CLOSE_STEP_1_DETAIL,
  TALLY_CLOSE_STEP_1_TITLE,
  TALLY_CLOSE_STEP_2_DETAIL,
  TALLY_CLOSE_STEP_2_TITLE,
  TALLY_REASON_LABEL,
} from "@/lib/ui/copy";

type CloseProposalDialogProps = {
  step: CloseStep;
  pending?: boolean;
  serverError?: string | null;
  onClose: (input: { reason: string; confirmedIrreversible: boolean }) => void;
  onCancel: () => void;
};

export function CloseProposalDialog({
  step,
  pending,
  serverError,
  onClose,
  onCancel,
}: CloseProposalDialogProps) {
  const [reason, setReason] = useState("");
  const isStepTwo = step === "STEP_2";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onClose({ reason, confirmedIrreversible: isStepTwo });
      }}
      className="flex w-full flex-col gap-[var(--spacing-form-gap-auth)] rounded-card border border-border bg-surface p-[var(--panel-pad)] shadow-card"
      noValidate
    >
      <h2 className="text-base font-semibold text-text-primary">
        {isStepTwo ? TALLY_CLOSE_STEP_2_TITLE : TALLY_CLOSE_STEP_1_TITLE}
      </h2>
      <p className="text-sm text-text-secondary">
        {isStepTwo ? TALLY_CLOSE_STEP_2_DETAIL : TALLY_CLOSE_STEP_1_DETAIL}
      </p>
      <FormField
        id="close-reason"
        label={TALLY_REASON_LABEL}
        value={reason}
        onChange={setReason}
      />
      {serverError && (
        <p role="alert" className="text-sm text-danger">
          {serverError}
        </p>
      )}
      <div className="dialog-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {TALLY_CLOSE_CANCEL}
        </Button>
        <Button type="submit" loading={pending}>
          {TALLY_CLOSE_CONFIRM}
        </Button>
      </div>
    </form>
  );
}
