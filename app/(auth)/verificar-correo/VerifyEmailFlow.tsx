"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { OtpVerifyForm } from "@/components/organisms/OtpVerifyForm";
import { requestEmailCode, verifyEmailCode } from "./actions";
import {
  OTP_CONFIRMED_DETAIL,
  OTP_CONFIRMED_TITLE,
  OTP_DESCRIPTION,
  OTP_EXPIRED,
  OTP_FAILED,
  OTP_INVALIDATED,
  OTP_LOCKED,
  OTP_RESENT,
  OTP_TITLE,
} from "@/lib/ui/copy";
import { routes } from "@/lib/ui/routes";

const ERROR_COPY: Record<string, string> = {
  MISMATCH: OTP_FAILED,
  EXPIRED: OTP_EXPIRED,
  INVALIDATED: OTP_INVALIDATED,
  LOCKED: OTP_LOCKED,
  UNAVAILABLE: OTP_FAILED,
};

export function VerifyEmailFlow() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  return (
    <AuthTemplate minHeightClass="lg:min-h-[522px]" title={OTP_TITLE} description={OTP_DESCRIPTION}>
      {notice && (
        <p role="status" className="mb-3 text-sm text-success">
          {notice}
        </p>
      )}
      <OtpVerifyForm
        badgeLabel="Correo pendiente"
        serverError={error}
        verifying={verifying}
        resending={resending}
        onResend={async () => {
          setResending(true);
          await requestEmailCode();
          setResending(false);
          setNotice(OTP_RESENT);
        }}
        onVerify={async (code) => {
          setVerifying(true);
          setError(null);
          const outcome = await verifyEmailCode(code);
          setVerifying(false);
          if (outcome.ok) {
            setNotice(`${OTP_CONFIRMED_TITLE}. ${OTP_CONFIRMED_DETAIL}`);
            setTimeout(() => router.push(routes.cuenta()), 600);
          } else {
            setError(ERROR_COPY[outcome.code]);
          }
        }}
      />
    </AuthTemplate>
  );
}
