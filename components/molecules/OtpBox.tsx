"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { OtpInput } from "@/components/atoms/OtpInput";

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
    <div className="flex w-full flex-col gap-4">
      <OtpInput value={code} onChange={onCodeChange} />
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span aria-live="polite">
          {expired ? "El código expiró" : `Vigencia ${formatTime(remaining)}`}
        </span>
        <span>{attemptsLeft} intentos restantes</span>
      </div>
      <Button type="button" onClick={onVerify} loading={verifying}>
        Verificar código
      </Button>
      <Button type="button" variant="secondary" onClick={onResend} loading={resending}>
        Reenviar código
      </Button>
      <p className="text-sm text-text-secondary">
        Reenviar invalida el código anterior. Un código confirmado no se puede
        reutilizar.
      </p>
    </div>
  );
}
