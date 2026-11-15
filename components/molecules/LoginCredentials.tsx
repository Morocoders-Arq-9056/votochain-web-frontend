"use client";

import { PasswordInput } from "@/components/atoms/PasswordInput";
import { FormField } from "@/components/molecules/FormField";
import { LOGIN_EMAIL_LABEL, LOGIN_PASSWORD_LABEL } from "@/lib/ui/copy";

type LoginCredentialsProps = {
  email: string;
  password: string;
  passwordError?: string | null;
  onEmail: (value: string) => void;
  onPassword: (value: string) => void;
};

/**
 * Email + password pair for classic login (Figma Panel). Local format
 * hints only; credential judging lives server-side.
 */
export function LoginCredentials({
  email,
  password,
  passwordError,
  onEmail,
  onPassword,
}: LoginCredentialsProps) {
  return (
    <>
      <FormField
        id="login-email"
        label={LOGIN_EMAIL_LABEL}
        type="email"
        value={email}
        onChange={onEmail}
      />
      <div>
        <PasswordInput
          id="login-password"
          label={LOGIN_PASSWORD_LABEL}
          value={password}
          autoComplete="current-password"
          state={passwordError ? "error" : undefined}
          onChange={(event) => onPassword(event.target.value)}
        />
        {passwordError && (
          <p role="alert" className="mt-2 text-sm text-danger">
            {passwordError}
          </p>
        )}
      </div>
    </>
  );
}
