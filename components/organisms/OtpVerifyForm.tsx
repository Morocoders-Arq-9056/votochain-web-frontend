"use client";

import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { OtpBox } from "@/components/molecules/OtpBox";
import { Notice } from "@/components/molecules/Notice";
import {
  OTP_NOTICE_DETAIL,
  OTP_NOTICE_TITLE,
} from "@/lib/ui/copy";

type OtpVerifyFormProps = {
  badgeLabel: string;
  serverError?: string | null;
  successMessage?: string | null;
  verifying?: boolean;
  resending?: boolean;
  onVerify: (code: string) => void;
  onResend: () => void;
};

export function OtpVerifyForm({
  badgeLabel,
  serverError,
  successMessage,
  verifying,
  resending,
  onVerify,
  onResend,
}: OtpVerifyFormProps) {
  const [code, setCode] = useState("");
  return (
    <div className="flex w-full flex-col gap-4">
      <Badge tone="neutral">{badgeLabel}</Badge>
      <Notice tone="info" title={OTP_NOTICE_TITLE} detail={OTP_NOTICE_DETAIL} />
      {serverError && (
        <p role="alert" className="text-sm text-danger">
          {serverError}
        </p>
      )}
      {successMessage && (
        <p role="status" className="text-sm text-success">
          {successMessage}
        </p>
      )}
      <OtpBox
        code={code}
        onCodeChange={setCode}
        onVerify={() => onVerify(code)}
        onResend={onResend}
        verifying={verifying}
        resending={resending}
      />
    </div>
  );
}
