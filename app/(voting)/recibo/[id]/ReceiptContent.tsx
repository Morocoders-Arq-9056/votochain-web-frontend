import { notFound } from "next/navigation";
import { VoteReceiptTimeline } from "@/components/organisms/VoteReceiptTimeline";
import { voteDeliveryPort } from "@/lib/infrastructure/api/composition";

export async function ReceiptContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const receipt = await voteDeliveryPort().getReceipt(id, "0x0000000000000000000000000000000000000000");
  if (!receipt) notFound();

  return (
    <VoteReceiptTimeline
      proposal="Mantenimiento de áreas comunes"
      receipt={receipt}
      explorerUrl={
        receipt.status === "CONFIRMED"
          ? "https://explorador.example/voto/0x9f3a"
          : undefined
      }
    />
  );
}
