"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IdentityTemplate } from "@/components/templates/IdentityTemplate";
import { AccountSecurityPanel } from "@/components/organisms/AccountSecurityPanel";
import { identityNav } from "@/components/organisms/identityNav";
import {
  ACCOUNT_DESCRIPTION,
  ACCOUNT_EYEBROW,
  ACCOUNT_TITLE,
} from "@/lib/ui/copy";
import { routes } from "@/lib/ui/routes";

export function AccountFlow() {
  const router = useRouter();
  const [notice, setNotice] = useState<string | null>(null);
  return (
    <IdentityTemplate
      eyebrow={ACCOUNT_EYEBROW}
      title={ACCOUNT_TITLE}
      description={ACCOUNT_DESCRIPTION}
      nav={identityNav("account")}
    >
      <AccountSecurityPanel
        email="maria.quispe@correo.pe"
        verified
        history={[
          {
            actor: "Sesión actual · Lima",
            occurredAt: "12/02/2026 · 09:10 PET (UTC-5) · María Quispe",
            reason: "Ingreso con contraseña.",
          },
          {
            actor: "Sesión anterior cerrada",
            occurredAt: "11/02/2026 · 18:35 PET (UTC-5) · Sistema",
            reason: "Nuevo inicio de sesión.",
          },
        ]}
        notice={notice}
        onAction={(action) => {
          if (action === "signout") router.push(routes.login());
          if (action === "password") router.push(routes.solicitarCodigo());
          if (action === "email") router.push(routes.verificarCorreo());
          if (action === "google") setNotice("Google ya está vinculada a su cuenta.");
        }}
      />
    </IdentityTemplate>
  );
}
