"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { Button } from "@/components/atoms/Button";
import { RegisterForm } from "@/components/organisms/RegisterForm";
import {
  CONTINUE_LABEL,
  REGISTER_CREATED_DETAIL,
  REGISTER_CREATED_TITLE,
  REGISTER_DESCRIPTION,
  REGISTER_DUPLICATE,
  REGISTER_INVALID_EMAIL,
  REGISTER_INVALID_PASSWORD,
  REGISTER_LOGIN_LINK,
  REGISTER_TERMS_REQUIRED,
  REGISTER_TITLE,
} from "@/lib/ui/copy";
import { routes } from "@/lib/ui/routes";
import { registerUser } from "./actions";

export function RegisterFlow() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState(false);

  return (
    <AuthTemplate minHeightClass="lg:min-h-[417px]" title={REGISTER_TITLE} description={REGISTER_DESCRIPTION}>
      {created ? (
        <div className="flex flex-col gap-2" role="status">
          <p className="text-base font-semibold text-text-primary">{REGISTER_CREATED_TITLE}</p>
          <p className="text-sm text-text-secondary">{REGISTER_CREATED_DETAIL}</p>
          <Button type="button" onClick={() => router.push(routes.verificarCorreo())}>
            {CONTINUE_LABEL}
          </Button>
        </div>
      ) : (
        <RegisterForm
          pending={pending}
          serverError={error}
          loginLinkLabel={REGISTER_LOGIN_LINK}
          onLoginLink={() => router.push(routes.login())}
          onSubmit={async (input) => {
            setPending(true);
            setError(null);
            const outcome = await registerUser(input);
            setPending(false);
            if (outcome.ok) {
              setCreated(true);
            } else if (outcome.code === "DUPLICATE") {
              setError(REGISTER_DUPLICATE);
            } else if (outcome.code === "TERMS_REQUIRED") {
              setError(REGISTER_TERMS_REQUIRED);
            } else if (outcome.code === "INVALID_PASSWORD") {
              setError(REGISTER_INVALID_PASSWORD);
            } else {
              setError(REGISTER_INVALID_EMAIL);
            }
          }}
        />
      )}
    </AuthTemplate>
  );
}
