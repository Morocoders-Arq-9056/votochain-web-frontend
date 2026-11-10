import { VoteFlow } from "./VoteFlow";

export async function VoteContent({
  searchParams,
}: {
  searchParams: Promise<{ authorization?: string; proposal?: string }>;
}) {
  const { authorization } = await searchParams;
  return <VoteFlow authorizationId={authorization || "AUT-4821-0212"} />;
}
