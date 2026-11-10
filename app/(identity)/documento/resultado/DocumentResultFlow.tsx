"use client";

import { useRouter } from "next/navigation";
import { IdentityTemplate } from "@/components/templates/IdentityTemplate";
import { DocumentResultPanel } from "@/components/organisms/DocumentResultPanel";
import { identityNav } from "@/components/organisms/identityNav";
import {
  DOCUMENT_DESCRIPTION,
  DOCUMENT_MATCH_DETAIL,
  DOCUMENT_MATCH_TITLE,
  DOCUMENT_TITLE,
} from "@/lib/ui/copy";
import { routes } from "@/lib/ui/routes";

export function DocumentResultFlow() {
  const router = useRouter();
  return (
    <IdentityTemplate
      title={DOCUMENT_TITLE}
      description={DOCUMENT_DESCRIPTION}
      nav={identityNav("identity")}
    >
      <DocumentResultPanel
        statusTone="success"
        statusLabel="Coincide"
        lines={[DOCUMENT_MATCH_TITLE, DOCUMENT_MATCH_DETAIL]}
        noticeTitle={DOCUMENT_MATCH_TITLE}
        noticeDetail={DOCUMENT_MATCH_DETAIL}
        noticeTone="success"
        history={[
          { actor: "Sistema", occurredAt: "Hoy", reason: "Validó anverso y reverso." },
          { actor: "Sistema", occurredAt: "Hoy", reason: "Comparó su rostro con el documento." },
        ]}
        onContinue={() => router.push(routes.biometria())}
      />
    </IdentityTemplate>
  );
}
