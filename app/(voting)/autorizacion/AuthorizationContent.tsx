import { AuthorizationFlow } from "./AuthorizationFlow";
import { getAuthorization } from "@/lib/application/get-authorization";

export async function AuthorizationContent({
  searchParams,
}: {
  searchParams: Promise<{ caso?: string | string[] }>;
}) {
  const { caso } = await searchParams;
  const data = await getAuthorization(
    typeof caso === "string" ? caso : undefined,
  );
  return <AuthorizationFlow data={data} />;
}
