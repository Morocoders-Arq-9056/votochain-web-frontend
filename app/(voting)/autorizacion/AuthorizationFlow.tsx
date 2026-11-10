"use client";

import { useRouter } from "next/navigation";
import { BottomNavigation } from "@/components/organisms/BottomNavigation";
import { VoteAuthorizationChecklist } from "@/components/organisms/VoteAuthorizationChecklist";
import type { AuthorizationOutcome } from "@/lib/domain/voting/vote-authorization.vo";
import type { ChecklistCriterion } from "@/lib/ui/checklist";
import { routes } from "@/lib/ui/routes";

const NAV_ITEMS = [
  { href: routes.home(), label: "Inicio", icon: "home" as const },
  { href: routes.votar(), label: "Votar", icon: "vote" as const, active: true },
  { href: routes.recibo("demo"), label: "Mi recibo", icon: "receipt" as const },
];

export function AuthorizationFlow({
  criteria,
  outcome,
  proposalId,
}: {
  criteria: ChecklistCriterion[];
  outcome: AuthorizationOutcome;
  proposalId: string;
}) {
  const router = useRouter();
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-bg px-4 py-6 md:max-w-3xl lg:max-w-5xl">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 md:max-w-2xl lg:max-w-3xl">
        <VoteAuthorizationChecklist
          proposal="Mantenimiento de áreas comunes"
          criteria={criteria}
          outcome={outcome}
          onVoteNow={() =>
            router.push(
              routes.votar({
                authorization:
                  outcome.kind === "AUTHORIZED"
                    ? outcome.authorization.code
                    : undefined,
                proposal: proposalId,
              }),
            )
          }
          onStartLiveness={() => router.push(routes.documento())}
          onRequestAgain={() => router.refresh()}
        />
      </div>
      <div className="lg:hidden">
        <BottomNavigation items={NAV_ITEMS} />
      </div>
    </main>
  );
}
