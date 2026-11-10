"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { ConsentCheckbox } from "@/components/atoms/ConsentCheckbox";
import { FormField } from "@/components/molecules/FormField";
import {
  REGISTER_CONSENT,
  REGISTER_EMAIL_LABEL,
  REGISTER_INVALID_EMAIL,
  REGISTER_SUBMIT,
  REGISTER_TERMS_REQUIRED,
} from "@/lib/ui/copy";

type RegisterFormProps = {
  pending?: boolean;
  serverError?: string | null;
  onSubmit: (input: { email: string; consent: boolean }) => void;
  onLoginLink: () => void;
  loginLinkLabel: string;
};

export function RegisterForm({
  pending,
  serverError,
  onSubmit,
  onLoginLink,
  loginLinkLabel,
}: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState(false);
  const emailInvalid = touched && !/^\S+@\S+\.\S+$/.test(email);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        onSubmit({ email, consent });
      }}
      className="flex w-full flex-col gap-[var(--spacing-form-gap-auth)]"
      noValidate
    >
      <FormField
        id="register-email"
        label={REGISTER_EMAIL_LABEL}
        type="email"
        value={email}
        state={emailInvalid ? "error" : "default"}
        hint={emailInvalid ? REGISTER_INVALID_EMAIL : undefined}
        onChange={setEmail}
      />
      <ConsentCheckbox
        id="register-consent"
        checked={consent}
        description={REGISTER_CONSENT}
        error={touched && !consent ? REGISTER_TERMS_REQUIRED : undefined}
        onChange={setConsent}
      />
      {serverError && (
        <p role="alert" className="text-sm text-danger">
          {serverError}
        </p>
      )}
      <div className="form-actions-stacked">
        <Button type="submit" loading={pending}>
          {REGISTER_SUBMIT}
        </Button>
        <Button type="button" variant="ghost" onClick={onLoginLink} className="text-brand-primary">
          {loginLinkLabel}
        </Button>
      </div>
    </form>
  );
}
