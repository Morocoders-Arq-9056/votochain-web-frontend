"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { NewSecretForm } from "@/components/organisms/NewSecretForm";
import { OtpVerifyForm } from "@/components/organisms/OtpVerifyForm";
import {
  requestRecoveryCode,
  requestVoteCode,
  resetRecoverySecret,
  verifyRecoveryCode,
  verifyVoteCode,
} from "./actions";
import {
  ENTER_CODE_DESCRIPTION,
  ENTER_CODE_RECOVERY_VERIFIED,
  ENTER_CODE_TITLE,
  NEW_SECRET_DESCRIPTION,
  NEW_SECRET_FAILED,
  NEW_SECRET_SAVED,
  NEW_SECRET_TITLE,
  OTP_FAILED,
  OTP_RESENT,
} from "@/lib/ui/copy";
import { routes } from "@/lib/ui/routes";

export function EnterCodeFlow({
  purpose = "vote",
  email,
}: {
  purpose?: "vote" | "recovery";
  email?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [codeOk, setCodeOk] = useState(false);
  const isRecovery = purpose === "recovery";

  async function saveSecret(secret: string) {
    setSaving(true);
    setError(null);
    const outcome = await resetRecoverySecret(secret, email);
    setSaving(false);
    if (outcome.ok) {
      setNotice(NEW_SECRET_SAVED);
      setTimeout(() => router.push(routes.login()), 900);
    } else {
      setError(NEW_SECRET_FAILED);
    }
  }

  return (
    <AuthTemplate
      minHeightClass="lg:min-h-[522px]"
      title={isRecovery && codeOk ? NEW_SECRET_TITLE : ENTER_CODE_TITLE}
      description={
        isRecovery && codeOk ? NEW_SECRET_DESCRIPTION : ENTER_CODE_DESCRIPTION
      }
    >
      {notice && (
        <p role="status" className="mb-3 text-sm text-success">
          {notice}
        </p>
      )}
      {isRecovery && codeOk ? (
        <NewSecretForm
          serverError={error}
          pending={saving}
          onSubmit={saveSecret}
        />
      ) : (
        <OtpVerifyForm
          badgeLabel="Código de un solo uso"
          serverError={error}
          verifying={verifying}
          resending={resending}
          onResend={async () => {
            setResending(true);
            if (isRecovery) {
              await requestRecoveryCode(email);
            } else {
              await requestVoteCode();
            }
            setResending(false);
            setNotice(OTP_RESENT);
          }}
          onVerify={async (code) => {
            setVerifying(true);
            setError(null);
            const outcome = isRecovery
              ? await verifyRecoveryCode(code, email)
              : await verifyVoteCode(code);
            setVerifying(false);
            if (outcome.ok) {
              if (isRecovery) {
                setCodeOk(true);
                setNotice(ENTER_CODE_RECOVERY_VERIFIED);
              } else {
                setNotice(ENTER_CODE_RECOVERY_VERIFIED);
                setTimeout(() => router.push(routes.votar()), 600);
              }
            } else {
              setError(OTP_FAILED);
            }
          }}
        />
      )}
    </AuthTemplate>
  );
}
