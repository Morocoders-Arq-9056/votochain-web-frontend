"use server";

import { createCastVoteService } from "@/lib/application/cast-vote";
import { voteDeliveryPort } from "@/lib/infrastructure/api/composition";

/**
 * Server action for Voting BC UC4 (cast vote). The action is the inbound
 * adapter: it wires the application service to the concrete port and returns
 * a result the UI can render.
 */
export async function submitVote(input: {
  authorizationId: string;
  choice: string;
}) {
  const service = createCastVoteService(voteDeliveryPort());
  return service.castVote(input);
}
