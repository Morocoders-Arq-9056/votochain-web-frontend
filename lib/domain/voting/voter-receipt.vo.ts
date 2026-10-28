import { z } from "zod";

/**
 * Voter receipt — the voter's vote journey as the Voting BC records it.
 * Values mirror the backend `VoteStatus` (voting-verifiable-ledger).
 */
export const VoteStatusSchema = z.enum([
  "SIGNED",
  "QUEUED",
  "SENT",
  "CONFIRMED",
  "FAILED",
]);

export type VoteStatus = z.infer<typeof VoteStatusSchema>;

export const VoteJourneyStageSchema = z.enum([
  "SIGNED",
  "QUEUED",
  "SENT",
  "CONFIRMED",
  "FAILED",
]);

export type VoteJourneyStage = z.infer<typeof VoteJourneyStageSchema>;

export const VoterReceiptSchema = z
  .object({
    voteId: z.string().min(1),
    proposalId: z.string().min(1),
    voterAddress: z.string().min(1),
    choice: z.string().min(1),
    status: VoteStatusSchema,
    txHash: z.string().min(1).optional(),
  })
  .refine((receipt) => receipt.status !== "CONFIRMED" || Boolean(receipt.txHash), {
    message: "A confirmed receipt must carry its transaction hash",
  })
  .refine((receipt) => receipt.status === "CONFIRMED" || !receipt.txHash, {
    message: "Only a confirmed receipt may carry a transaction hash",
  });

export type VoterReceipt = z.infer<typeof VoterReceiptSchema>;

/**
 * The ordered lifecycle of a vote, as observed by the voter. Pure domain
 * knowledge: no copy, no presentation.
 */
export function voteJourney(status: VoteStatus): VoteJourneyStage[] {
  switch (status) {
    case "SIGNED":
      return ["SIGNED"];
    case "QUEUED":
      return ["SIGNED", "QUEUED"];
    case "SENT":
      return ["SIGNED", "QUEUED", "SENT"];
    case "CONFIRMED":
      return ["SIGNED", "QUEUED", "SENT", "CONFIRMED"];
    case "FAILED":
      return ["SIGNED", "QUEUED", "SENT", "FAILED"];
  }
}
