"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { RequestCodePanel } from "@/components/organisms/RequestCodePanel";
import { requestRecoveryCode } from "./actions";
import {
  REQUEST_CODE_DESCRIPTION,
  REQUEST_CODE_TITLE,
} from "@/lib/ui/copy";
import { routes } from "@/lib/ui/routes";

export function RequestCodeFlow() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <AuthTemplate minHeightClass="lg:min-h-[359px]" title={REQUEST_CODE_TITLE} description={REQUEST_CODE_DESCRIPTION}>
      <RequestCodePanel
        emailMasked="m***@example.pe"
        sent={sent}
        blocked={false}
        pending={pending}
        onRequest={async () => {
          setPending(true);
          await requestRecoveryCode();
          setPending(false);
          setSent(true);
        }}
        onContinue={() => router.push(routes.ingresarCodigo({ purpose: "recovery" }))}
      />
    </AuthTemplate>
  );
}
