import { Suspense } from "react";
import { CloseContent } from "./CloseContent";

export default function ClosePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <p className="text-base text-text-secondary">Cargando el escrutinio…</p>
      }
    >
      <CloseContent params={params} />
    </Suspense>
  );
}
