import { Suspense } from "react";
import { AuthorizationContent } from "./AuthorizationContent";

export default function AuthorizationPage({
  searchParams,
}: PageProps<"/autorizacion">) {
  return (
    <Suspense
      fallback={
        <p className="text-base text-text-secondary">
          Comprobando su elegibilidad…
        </p>
      }
    >
      <AuthorizationContent searchParams={searchParams} />
    </Suspense>
  );
}
