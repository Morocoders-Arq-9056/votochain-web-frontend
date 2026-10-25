import { Suspense } from "react";
import { ReceiptTemplate } from "@/components/templates/ReceiptTemplate";
import { ReceiptContent } from "./ReceiptContent";

export default function ReceiptPage({ params }: PageProps<"/recibo/[id]">) {
  return (
    <ReceiptTemplate>
      <Suspense
        fallback={
          <p className="text-base text-text-secondary">Cargando su recibo…</p>
        }
      >
        <ReceiptContent params={params} />
      </Suspense>
    </ReceiptTemplate>
  );
}
