"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import {
  LOGIN_EMAIL_LABEL,
  LOGIN_FOOTNOTE,
  LOGIN_GOOGLE,
  LOGIN_RECOVER,
  LOGIN_REGISTER_LINK,
  LOGIN_REGISTER_PROMPT,
  LOGIN_SUBMIT,
} from "@/lib/ui/copy";

type LoginFormProps = {
  pending?: boolean;
  serverError?: string | null;
  onSubmit: (input: { email: string }) => void;
  onGoogle: (email: string) => void;
  onRecover: (email: string) => void;
  onRegister: () => void;
};

export function LoginForm({
  pending,
  serverError,
  onSubmit,
  onGoogle,
  onRecover,
  onRegister,
}: LoginFormProps) {
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ email });
      }}
      className="flex w-full flex-col gap-[var(--spacing-form-gap-auth)]"
      noValidate
    >
      <FormField
        id="login-email"
        label={LOGIN_EMAIL_LABEL}
        type="email"
        value={email}
        onChange={setEmail}
      />
      {serverError && (
        <p role="alert" className="text-sm text-danger">
          {serverError}
        </p>
      )}
      <p className="text-sm text-text-secondary">
        {LOGIN_REGISTER_PROMPT}{" "}
        <button
          type="button"
          onClick={onRegister}
          className="font-semibold text-brand-primary underline underline-offset-2 hover:text-brand-deep"
        >
          {LOGIN_REGISTER_LINK}
        </button>
      </p>
      <div className="flex flex-col gap-[var(--spacing-form-gap-auth)]">
        <Button type="submit" loading={pending}>
          {LOGIN_SUBMIT}
        </Button>
        <Button type="button" variant="secondary" onClick={() => onGoogle(email)} className="text-brand-primary">
          {LOGIN_GOOGLE}
        </Button>
        <Button type="button" variant="ghost" onClick={() => onRecover(email)} className="text-brand-primary">
          {LOGIN_RECOVER}
        </Button>
      </div>
      <p className="text-sm text-text-secondary">{LOGIN_FOOTNOTE}</p>
    </form>
  );
}
