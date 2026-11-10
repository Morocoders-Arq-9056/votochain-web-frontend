"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Notice } from "@/components/molecules/Notice";
import {
  REQUEST_CODE_NO_CONTACT,
  REQUEST_CODE_SENT_DETAIL,
  REQUEST_CODE_SENT_TITLE,
  REQUEST_CODE_SUBMIT,
} from "@/lib/ui/copy";

type RequestCodePanelProps = {
  emailMasked: string;
  sent: boolean;
  blocked: boolean;
  pending?: boolean;
  onRequest: () => void;
  onContinue: () => void;
};

export function RequestCodePanel({
  emailMasked,
  sent,
  blocked,
  pending,
  onRequest,
  onContinue,
}: RequestCodePanelProps) {
  const [detail] = useState(emailMasked);
  if (blocked) {
    return <Notice tone="warning" title={REQUEST_CODE_SENT_TITLE} detail={REQUEST_CODE_NO_CONTACT} />;
  }
  return (
    <div className="flex w-full flex-col gap-4">
      <Badge tone={sent ? "success" : "neutral"}>
        {sent ? REQUEST_CODE_SENT_TITLE : "Pendiente"}
      </Badge>
      <p className="text-sm text-text-secondary">
        {sent ? REQUEST_CODE_SENT_DETAIL : detail}
      </p>
      {sent ? (
        <Button type="button" onClick={onContinue}>
          Continuar
        </Button>
      ) : (
        <Button type="button" onClick={onRequest} loading={pending}>
          {REQUEST_CODE_SUBMIT}
        </Button>
      )}
    </div>
  );
}
