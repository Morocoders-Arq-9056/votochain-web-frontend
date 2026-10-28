import {
  VoterReceiptSchema,
  type VoterReceipt,
} from "@/lib/domain/voting/voter-receipt.vo";

/**
 * Wire shape of the Voting BC (`VoteReceiptResource`). It never leaves
 * infrastructure: the assembler turns it into a domain `VoterReceipt`.
 */
export type VoteReceiptResource = {
  voteId: string;
  proposalId: string;
  voterAddress: string;
  choice: string;
  status: string;
  txHash: string | null;
};

export function toVoterReceipt(dto: VoteReceiptResource): VoterReceipt {
  const confirmed = dto.status.toUpperCase() === "CONFIRMED";
  return VoterReceiptSchema.parse({
    voteId: dto.voteId,
    proposalId: dto.proposalId,
    voterAddress: dto.voterAddress,
    choice: dto.choice,
    status: dto.status.toUpperCase(),
    txHash: confirmed ? (dto.txHash ?? undefined) : undefined,
  });
}
