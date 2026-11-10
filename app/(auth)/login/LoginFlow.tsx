"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { LoginForm } from "@/components/organisms/LoginForm";
import {
  LOGIN_CONFIRMED,
  LOGIN_DESCRIPTION,
  LOGIN_FAILED,
  LOGIN_LOCKED,
  LOGIN_NETWORK_UNREACHABLE,
  LOGIN_OUTSIDE_NOT_LINKED,
  LOGIN_PREVIOUS_SESSION,
  LOGIN_RECOVERY_FAILED,
  LOGIN_SUSPENDED,
  LOGIN_TITLE,
} from "@/lib/ui/copy";
import { routes } from "@/lib/ui/routes";
import { loginUser, recoverAccess } from "./actions";

const ERROR_COPY: Record<string, string> = {
  INVALID_CREDENTIALS: LOGIN_FAILED,
  LOCKED: LOGIN_LOCKED,
  SUSPENDED: LOGIN_SUSPENDED,
  PREVIOUS_SESSION: LOGIN_PREVIOUS_SESSION,
  OUTSIDE_NOT_LINKED: LOGIN_OUTSIDE_NOT_LINKED,
  NETWORK_UNREACHABLE: LOGIN_NETWORK_UNREACHABLE,
  UNAVAILABLE: LOGIN_FAILED,
};

export function LoginFlow() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(email: string, proofKind: "LOCAL" | "OUTSIDE") {
    setPending(true);
    setError(null);
    const outcome = await loginUser({ email, proofKind });
    setPending(false);
    if (outcome.ok) {
      setNotice(LOGIN_CONFIRMED);
      router.push(routes.cuenta());
    } else {
      setError(ERROR_COPY[outcome.code]);
    }
  }

  return (
    <AuthTemplate minHeightClass="lg:min-h-[560px]" title={LOGIN_TITLE} description={LOGIN_DESCRIPTION}>
      {notice && (
        <p role="status" className="mb-3 text-sm text-success">
          {notice}
        </p>
      )}
      <LoginForm
        pending={pending}
        serverError={error}
        onSubmit={(input) => submit(input.email, "LOCAL")}
        onGoogle={(email) => submit(email, "OUTSIDE")}
        onRegister={() => router.push(routes.registro())}
        onRecover={async (email) => {
          const outcome = await recoverAccess(email);
          if (outcome.ok) {
            router.push(routes.ingresarCodigo({ purpose: "recovery", email }));
          } else {
            setError(LOGIN_RECOVERY_FAILED);
          }
        }}
      />
    </AuthTemplate>
  );
}
