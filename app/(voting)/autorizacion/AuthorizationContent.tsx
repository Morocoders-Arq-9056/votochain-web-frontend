import { AuthorizationFlow } from "./AuthorizationFlow";
import { cookies } from "next/headers";
import { createRequestAuthorizationService } from "@/lib/application/request-authorization";
import { authorizationPort } from "@/lib/infrastructure/api/composition";
import { checklistCriteria } from "@/lib/ui/checklist";

export async function AuthorizationContent({
  searchParams,
}: {
  searchParams: Promise<{ caso?: string | string[]; proposal?: string }>;
}) {
  const { caso, proposal } = await searchParams;
  const personId = (await cookies()).get("personId")?.value ?? "";
  const service = createRequestAuthorizationService(
    authorizationPort(typeof caso === "string" ? caso : undefined),
  );
  const { outcome, snapshot } = await service.request({
    proposalId: proposal || "propuesta-demo",
    personId,
  });

  return (
    <AuthorizationFlow
      criteria={checklistCriteria(snapshot)}
      outcome={outcome}
      proposalId={proposal || "propuesta-demo"}
    />
  );
}
