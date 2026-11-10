"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IdentityTemplate } from "@/components/templates/IdentityTemplate";
import { AccessContext } from "@/components/molecules/AccessContext";
import { BiometricEnrollPanel } from "@/components/organisms/BiometricEnrollPanel";
import { enrollBiometricReference } from "./actions";
import { identityNav } from "@/components/organisms/identityNav";
import {
  BIOMETRIC_DESCRIPTION,
  BIOMETRIC_GUIDE,
  BIOMETRIC_TITLE,
} from "@/lib/ui/copy";
import { routes } from "@/lib/ui/routes";

export function BiometricFlow() {
  const router = useRouter();
  const [captured, setCaptured] = useState(false);
  const [processing, setProcessing] = useState(false);

  return (
    <IdentityTemplate
      title={BIOMETRIC_TITLE}
      description={BIOMETRIC_DESCRIPTION}
      nav={identityNav("identity")}
    >
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,600px)_minmax(0,449px)] lg:gap-[var(--spacing-auth-gap)]">
        <div className="hidden lg:block">
          <AccessContext />
        </div>
        <BiometricEnrollPanel
        statusLabel={captured ? "Referencia lista" : "Preparación"}
        guide={BIOMETRIC_GUIDE}
        captured={captured}
        processing={processing}
        continueLabel="Continuar a prueba de vida"
        onCapture={async () => {
          setProcessing(true);
          await enrollBiometricReference();
          setProcessing(false);
          setCaptured(true);
        }}
        onRetry={() => setCaptured(false)}
        onContinue={() => router.push(routes.pruebaDeVida())}
        />
      </div>
    </IdentityTemplate>
  );
}
