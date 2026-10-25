"use client";

import { useRouter } from "next/navigation";
import { BottomNavigation } from "@/components/organisms/BottomNavigation";
import { VoteAuthorizationChecklist } from "@/components/organisms/VoteAuthorizationChecklist";
import type { AuthorizationCase } from "@/lib/domain/voting/authorization.vo";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: "home" as const },
  { href: "/votar", label: "Votar", icon: "vote" as const, active: true },
  { href: "/recibo/demo", label: "Mi recibo", icon: "receipt" as const },
];

export function AuthorizationFlow({ data }: { data: AuthorizationCase }) {
  const router = useRouter();
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-bg px-4 py-6">
      <div className="flex w-full flex-1 flex-col gap-4">
        <VoteAuthorizationChecklist
          proposal="Mantenimiento de áreas comunes"
          membership={data.membership}
          biometrics={data.biometrics}
          result={data.result}
          onVoteNow={() => router.push("/votar")}
          onStartLiveness={() => router.push("/documento")}
          onRequestAgain={() => router.refresh()}
        />
      </div>
      <BottomNavigation items={NAV_ITEMS} />
    </main>
  );
}
