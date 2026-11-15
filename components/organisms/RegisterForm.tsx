"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { ConsentCheckbox } from "@/components/atoms/ConsentCheckbox";
import { PasswordInput } from "@/components/atoms/PasswordInput";
import { FormField } from "@/components/molecules/FormField";
import {
  REGISTER_CONSENT,
  REGISTER_EMAIL_LABEL,
  REGISTER_INVALID_EMAIL,
  REGISTER_INVALID_PASSWORD,
  REGISTER_PASSWORD_LABEL,
  REGISTER_SUBMIT,
  REGISTER_TERMS_REQUIRED,
} from "@/lib/ui/copy";

type RegisterFormProps = {
  pending?: boolean;
  serverError?: string | null;
  onSubmit: (input: { email: string; password: string; consent: boolean }) => void;
  onLoginLink: () => void;
  loginLinkLabel: string;
};

function passwordHint(value: string): string | undefined {
  if (!value) return undefined;
  if (
    value.length >= 12 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value)
  )
    return undefined;
  return REGISTER_INVALID_PASSWORD;
}

export function RegisterForm({
  pending,
  serverError,
  onSubmit,
  onLoginLink,
  loginLinkLabel,
}: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState(false);
  const emailInvalid = touched && !/^\S+@\S+\.\S+$/.test(email);
  const passwordError = touched ? passwordHint(password) : undefined;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (emailInvalid || passwordHint(password)) return;
        onSubmit({ email, password, consent });
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
      <div>
        <PasswordInput
          id="register-password"
          label={REGISTER_PASSWORD_LABEL}
          value={password}
          autoComplete="new-password"
          state={passwordError ? "error" : undefined}
          onChange={(event) => setPassword(event.target.value)}
        />
        {passwordError && (
          <p role="alert" className="mt-2 text-sm text-danger">
            {passwordError}
          </p>
        )}
      </div>
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
