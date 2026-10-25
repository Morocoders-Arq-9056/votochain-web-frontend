import { Suspense } from "react";
import { VotePageContent } from "./VotePageContent";

export default function VotePage({ searchParams }: PageProps<"/votar">) {
  return (
    <Suspense
      fallback={
        <p className="text-base text-text-secondary">Cargando su votación…</p>
      }
    >
      <VotePageContent searchParams={searchParams} />
    </Suspense>
  );
}
