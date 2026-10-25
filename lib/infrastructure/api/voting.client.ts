import {
  CastVoteInputSchema,
  toIdempotencyKey,
  type CastVoteInput,
} from "@/lib/domain/voting/cast-vote.vo";
import { ApiError, apiFetch } from "@/lib/infrastructure/api-client";
import {
  toCastVoteError,
  toReceipt,
  type VoteReceiptResource,
} from "@/lib/infrastructure/mappers/voting.mapper";
import type { Receipt } from "@/lib/domain/voting/receipt.vo";

const MAX_ATTEMPTS = 2;

function isRetryable(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.status === 0 || error.status >= 500)
  );
}

export async function castVote(input: CastVoteInput): Promise<Receipt> {
  const parsed = CastVoteInputSchema.parse(input);
  const idempotencyKey = toIdempotencyKey(parsed);

  let lastError: unknown = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const dto = await apiFetch<VoteReceiptResource>("/votes", {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey },
        body: JSON.stringify(parsed),
      });
      return toReceipt(dto);
    } catch (error) {
      lastError = error;
      if (!isRetryable(error)) break;
    }
  }

  if (lastError instanceof ApiError) {
    throw new Error(
      toCastVoteError(lastError.status, lastError.backendMessage),
    );
  }
  throw lastError;
}

export async function getVoteReceipt(
  proposalId: string,
  voterAddress: string,
): Promise<Receipt> {
  const dto = await apiFetch<VoteReceiptResource>(
    `/votes/receipt?proposal=${encodeURIComponent(proposalId)}&voter=${encodeURIComponent(voterAddress)}`,
  );
  return toReceipt(dto);
}
