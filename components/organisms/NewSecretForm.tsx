"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { PasswordInput } from "@/components/atoms/PasswordInput";
import {
  NEW_SECRET_LABEL,
  NEW_SECRET_SUBMIT,
} from "@/lib/ui/copy";

type NewSecretFormProps = {
  serverError?: string | null;
  pending?: boolean;
  onSubmit: (secret: string) => void;
};

export function NewSecretForm({
  serverError,
  pending,
  onSubmit,
}: NewSecretFormProps) {
  const [secret, setSecret] = useState("");
  return (
    <form
      className="flex w-full flex-col gap-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(secret);
      }}
    >
      {serverError && (
        <p role="alert" className="text-sm text-danger">
          {serverError}
        </p>
      )}
      <PasswordInput
        id="new-secret"
        label={NEW_SECRET_LABEL}
        value={secret}
        autoComplete="new-password"
        onChange={(e) => setSecret(e.target.value)}
      />
      <Button type="submit" loading={pending}>
        {NEW_SECRET_SUBMIT}
      </Button>
    </form>
  );
}
