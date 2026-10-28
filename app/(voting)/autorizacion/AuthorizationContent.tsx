import { AuthorizationFlow } from "./AuthorizationFlow";
import { createRequestAuthorizationService } from "@/lib/application/request-authorization";
import { authorizationPort } from "@/lib/infrastructure/api/composition";
import { checklistCriteria } from "@/lib/ui/checklist";

export async function AuthorizationContent({
  searchParams,
}: {
  searchParams: Promise<{ caso?: string | string[] }>;
}) {
  const { caso } = await searchParams;
  const service = createRequestAuthorizationService(
    authorizationPort(typeof caso === "string" ? caso : undefined),
  );
  const { outcome, snapshot } = await service.request("propuesta-demo");

  return (
    <AuthorizationFlow
      criteria={checklistCriteria(snapshot)}
      outcome={outcome}
    />
  );
}
