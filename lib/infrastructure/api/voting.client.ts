import { toVoteCastErrorCode } from "@/lib/infrastructure/api/error-mapping";
import { ApiError, apiFetch } from "@/lib/infrastructure/api-client";
import {
  toVoterReceipt,
  toVoterReceiptFromProof,
  type ProofResource,
  type VoteReceiptResource,
} from "@/lib/infrastructure/mappers/voting.mapper";
import type { CastVoteCommand } from "@/lib/domain/voting/cast-vote.vo";
import type { VoteDeliveryPort } from "@/lib/domain/voting/ports";
import { VoteCastError } from "@/lib/domain/voting/vote-cast-error";
import type { VoterReceipt } from "@/lib/domain/voting/voter-receipt.vo";

const MAX_ATTEMPTS = 2;

/**
 * Idempotency key for a cast. A `VoteAuthorization` is single use, so the
 * authorization id identifies exactly one vote: retrying with the same key
 * replays the same vote instead of creating a second one.
 */
export function idempotencyKeyFor(command: CastVoteCommand): string {
  return command.authorizationId;
}

function isRetryable(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 0 || error.status >= 500);
}

export class VotingDeliveryAdapter implements VoteDeliveryPort {
  async castVote(command: CastVoteCommand): Promise<VoterReceipt> {
    const idempotencyKey = idempotencyKeyFor(command);

    let lastError: unknown = null;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const dto = await apiFetch<VoteReceiptResource>("/votes", {
          method: "POST",
          headers: { "Idempotency-Key": idempotencyKey },
          body: JSON.stringify(command),
        });
        return toVoterReceipt(dto);
      } catch (error) {
        lastError = error;
        if (!isRetryable(error)) break;
      }
    }

    if (lastError instanceof ApiError) {
      throw new VoteCastError(
        toVoteCastErrorCode(lastError.status, lastError.backendMessage),
      );
    }
    throw new VoteCastError("UNEXPECTED");
  }

  async getReceipt(
    proposalId: string,
    voterAddress: string,
  ): Promise<VoterReceipt | null> {
    try {
      const dto = await apiFetch<VoteReceiptResource>(
        `/votes/receipt?proposal=${encodeURIComponent(proposalId)}&voter=${encodeURIComponent(voterAddress)}`,
      );
      return toVoterReceipt(dto);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw new VoteCastError(
        error instanceof ApiError
          ? toVoteCastErrorCode(error.status, error.backendMessage)
          : "UNEXPECTED",
      );
    }
  }

  async getReceiptById(voteId: string): Promise<VoterReceipt | null> {
    try {
      const dto = await apiFetch<ProofResource>(
        `/votes/${encodeURIComponent(voteId)}`,
      );
      return toVoterReceiptFromProof(dto);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw new VoteCastError(
        error instanceof ApiError
          ? toVoteCastErrorCode(error.status, error.backendMessage)
          : "UNEXPECTED",
      );
    }
  }
}

export const votingDeliveryPort = new VotingDeliveryAdapter();
