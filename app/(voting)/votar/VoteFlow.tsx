"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomNavigation } from "@/components/organisms/BottomNavigation";
import { SignModal } from "@/components/organisms/SignModal";
import { VoteForm, type VoteOption } from "@/components/organisms/VoteForm";
import {
  CONSUMED_AUTHORIZATION_DETAIL,
  CONSUMED_AUTHORIZATION_TITLE,
  LATE_VOTE_DETAIL,
  LATE_VOTE_TITLE,
} from "@/lib/infrastructure/ui-labels";

const OPTIONS: VoteOption[] = [
  { value: "SI", label: "Sí", description: "Apruebo la propuesta" },
  { value: "NO", label: "No", description: "No apruebo la propuesta" },
  { value: "ABSTENCION", label: "Abstención" },
];

const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: "home" as const },
  { href: "/votar", label: "Votar", icon: "vote" as const, active: true },
  { href: "/recibo/demo", label: "Mi recibo", icon: "receipt" as const },
];

export function VoteFlow({ edgeCase }: { edgeCase?: string }) {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [signing, setSigning] = useState(false);

  const selectedOption = OPTIONS.find((o) => o.value === selectedValue);

  const handleSign = () => {
    setSigning(true);
    router.push("/recibo/demo");
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-bg px-4 py-6">
      <div className="flex w-full flex-1 flex-col gap-4">
        <VoteForm
          proposalTitle="Mantenimiento de áreas comunes"
          frozenRule="Regla aplicada: 50%+1 sobre activos al abrir 12/02/2026"
          voterSummary="María Quispe · DNI 4821xxxx · Dpto 302"
          authorizationCode="AUT-4821-0212"
          validUntil="10:05 PET (UTC−5)"
          options={OPTIONS}
          selectedValue={selectedValue}
          onSelect={setSelectedValue}
          onRequestSignature={() => setModalOpen(true)}
          signing={signing}
        />

        {edgeCase === "doble" && (
          <div className="flex flex-col gap-1 rounded-md border border-border bg-bg-danger p-4">
            <span className="text-base font-semibold text-danger">
              {CONSUMED_AUTHORIZATION_TITLE}
            </span>
            <span className="text-sm text-text-secondary">
              {CONSUMED_AUTHORIZATION_DETAIL}
            </span>
          </div>
        )}

        {edgeCase === "tardio" && (
          <div className="flex flex-col gap-1 rounded-md border border-border bg-bg-danger p-4">
            <span className="text-base font-semibold text-danger">
              {LATE_VOTE_TITLE}
            </span>
            <span className="text-sm text-text-secondary">{LATE_VOTE_DETAIL}</span>
          </div>
        )}
      </div>

      <BottomNavigation items={NAV_ITEMS} />

      <SignModal
        open={modalOpen}
        proposalTitle="Mantenimiento de áreas comunes"
        optionLabel={selectedOption ? `${selectedOption.label}${selectedOption.description ? ` · ${selectedOption.description}` : ""}` : ""}
        voterSummary="María Quispe · DNI 4821xxxx · Dpto 302"
        onSign={handleSign}
        onCancel={() => setModalOpen(false)}
        signing={signing}
      />
    </main>
  );
}
