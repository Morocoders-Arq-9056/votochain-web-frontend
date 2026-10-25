import { notFound } from "next/navigation";
import { VoteReceiptTimeline } from "@/components/organisms/VoteReceiptTimeline";
import { getReceipt } from "@/lib/application/get-receipt";

export async function ReceiptContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const receipt = await getReceipt(id);
  if (!receipt) notFound();

  return (
    <VoteReceiptTimeline
      proposal={receipt.proposal}
      steps={receipt.steps}
      result={receipt.result}
    />
  );
}
