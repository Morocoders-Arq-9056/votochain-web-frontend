"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { BottomNavigation } from "@/components/organisms/BottomNavigation";
import { SignModal } from "@/components/organisms/SignModal";
import { VoteForm, type VoteOption } from "@/components/organisms/VoteForm";
import { VOTE_CAST_DETAILS, VOTE_CAST_MESSAGES } from "@/lib/ui/copy";
import { submitVote } from "./actions";

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

export function VoteFlow() {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<{ title: string; detail: string } | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const selectedOption = OPTIONS.find((option) => option.value === selectedValue);

  const handleSign = () => {
    if (!selectedValue) return;
    startTransition(async () => {
      const result = await submitVote({
        authorizationId: "AUT-4821-0212",
        choice: selectedValue,
      });
      if (result.ok) {
        setModalOpen(false);
        router.push(`/recibo/${result.receipt.voteId}`);
        return;
      }
      setError({
        title: VOTE_CAST_MESSAGES[result.code],
        detail: VOTE_CAST_DETAILS[result.code],
      });
      setModalOpen(false);
    });
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
          signing={isPending}
        />

        {error && (
          <div className="flex flex-col gap-1 rounded-md border border-border bg-bg-danger p-4">
            <span className="text-base font-semibold text-danger">
              {error.title}
            </span>
            <span className="text-sm text-text-secondary">{error.detail}</span>
          </div>
        )}
      </div>

      <BottomNavigation items={NAV_ITEMS} />

      <SignModal
        open={modalOpen}
        proposalTitle="Mantenimiento de áreas comunes"
        optionLabel={
          selectedOption
            ? `${selectedOption.label}${selectedOption.description ? ` · ${selectedOption.description}` : ""}`
            : ""
        }
        voterSummary="María Quispe · DNI 4821xxxx · Dpto 302"
        onSign={handleSign}
        onCancel={() => setModalOpen(false)}
        signing={isPending}
      />
    </main>
  );
}
