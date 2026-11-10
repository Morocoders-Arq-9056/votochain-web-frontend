"use server";

import { createCloseProposalService } from "@/lib/application/close-proposal";
import { createTallyService } from "@/lib/application/get-tally";
import { tallyPort } from "@/lib/infrastructure/api/composition";

export async function getTally(proposalId: string) {
  return createTallyService(tallyPort()).tally(proposalId);
}

export async function closeProposal(input: {
  proposalId: string;
  reason: string;
  confirmedIrreversible: boolean;
}) {
  return createCloseProposalService(tallyPort()).close(input);
}
