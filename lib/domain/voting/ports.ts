import type { AuthorizationFacts } from "@/lib/domain/voting/authorization-facts.vo";
import type { CastVoteCommand } from "@/lib/domain/voting/cast-vote.vo";
import type { VoteCastErrorCode } from "@/lib/domain/voting/vote-cast-error";
import type { VoterReceipt } from "@/lib/domain/voting/voter-receipt.vo";

/**
 * Ports declared by the domain and implemented by infrastructure. The
 * application layer depends on these, never on HTTP.
 */
export interface VoteDeliveryPort {
  castVote(command: CastVoteCommand): Promise<VoterReceipt>;
  getReceipt(
    proposalId: string,
    voterAddress: string,
  ): Promise<VoterReceipt | null>;
}

export interface AuthorizationPort {
  request(proposalId: string): Promise<AuthorizationFacts>;
}

export type CastVoteOutcome =
  | { ok: true; receipt: VoterReceipt }
  | { ok: false; code: VoteCastErrorCode };
