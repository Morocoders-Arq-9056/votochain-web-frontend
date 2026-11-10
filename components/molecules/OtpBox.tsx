"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { OtpInput } from "@/components/atoms/OtpInput";
import {
  OTP_ATTEMPTS_LEFT,
  OTP_EXPIRED,
  OTP_RESEND,
  OTP_RESEND_NOTE,
  OTP_VALIDITY,
  OTP_VERIFY,
} from "@/lib/ui/copy";

type OtpBoxProps = {
  code: string;
  onCodeChange: (code: string) => void;
  onVerify?: () => void;
  onResend?: () => void;
  validitySeconds?: number;
  attemptsLeft?: number;
  resending?: boolean;
  verifying?: boolean;
};

function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function OtpBox({
  code,
  onCodeChange,
  onVerify,
  onResend,
  validitySeconds = 300,
  attemptsLeft = 5,
  resending = false,
  verifying = false,
}: OtpBoxProps) {
  const [remaining, setRemaining] = useState(validitySeconds);
  const [previousValidity, setPreviousValidity] = useState(validitySeconds);

  if (previousValidity !== validitySeconds) {
    setPreviousValidity(validitySeconds);
    setRemaining(validitySeconds);
  }

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const expired = remaining <= 0;

  return (
    <div className="flex w-full flex-col gap-[var(--spacing-form-gap)]">
      <OtpInput value={code} onChange={onCodeChange} />
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span aria-live="polite">
          {expired ? OTP_EXPIRED : `${OTP_VALIDITY} ${formatTime(remaining)}`}
        </span>
        <span>
          {attemptsLeft} {OTP_ATTEMPTS_LEFT}
        </span>
      </div>
      <div className="form-actions-stacked">
        <Button type="button" onClick={onVerify} loading={verifying}>
          {OTP_VERIFY}
        </Button>
        <Button type="button" variant="secondary" onClick={onResend} loading={resending}>
          {OTP_RESEND}
        </Button>
      </div>
      <p className="text-sm text-text-secondary">{OTP_RESEND_NOTE}</p>
    </div>
  );
}
