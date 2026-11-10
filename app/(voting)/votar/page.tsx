import { Suspense } from "react";
import { VoteContent } from "./VoteContent";

export default function VotePage({
  searchParams,
}: {
  searchParams: Promise<{ authorization?: string; proposal?: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <VoteContent searchParams={searchParams} />
    </Suspense>
  );
}
