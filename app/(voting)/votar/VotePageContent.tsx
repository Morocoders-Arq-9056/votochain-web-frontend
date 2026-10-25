import { VoteFlow } from "./VoteFlow";

export async function VotePageContent({
  searchParams,
}: {
  searchParams: Promise<{ caso?: string | string[] }>;
}) {
  const { caso } = await searchParams;
  return <VoteFlow edgeCase={typeof caso === "string" ? caso : undefined} />;
}
