import { CloseFlow } from "./CloseFlow";
import { getTally } from "./actions";

export async function CloseContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tally = await getTally(id);
  return <CloseFlow proposalId={id} initialTally={tally} />;
}
