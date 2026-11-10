"use client";

import { useRouter } from "next/navigation";
import { IdentityTemplate } from "@/components/templates/IdentityTemplate";
import { VerificationStatusPanel } from "@/components/organisms/VerificationStatusPanel";
import { identityNav } from "@/components/organisms/identityNav";
import {
  VERIFICATION_ACTIVE_DETAIL,
  VERIFICATION_ACTIVE_TITLE,
  VERIFICATION_GO_VOTE,
  VERIFICATION_STATUS_TITLE,
} from "@/lib/ui/copy";
import { routes } from "@/lib/ui/routes";

export function VerificationStatusFlow() {
  const router = useRouter();
  return (
    <IdentityTemplate
      title={VERIFICATION_STATUS_TITLE}
      description={VERIFICATION_ACTIVE_DETAIL}
      nav={identityNav("identity")}
    >
      <VerificationStatusPanel
        statusTone="success"
        statusLabel={VERIFICATION_ACTIVE_TITLE}
        detail={VERIFICATION_ACTIVE_DETAIL}
        actionLabel={VERIFICATION_GO_VOTE}
        onAction={() => router.push(routes.votar())}
        history={[
          { actor: "Sistema", occurredAt: "Hoy", reason: "Creó su referencia biométrica." },
          { actor: "Usted", occurredAt: "Hoy", reason: "Completó su prueba de vida." },
        ]}
      />
    </IdentityTemplate>
  );
}
