import { CastVoteCommandSchema } from "@/lib/domain/voting/cast-vote.vo";
import type { CastVoteOutcome, VoteDeliveryPort } from "@/lib/domain/voting/ports";
import { VoteCastError } from "@/lib/domain/voting/vote-cast-error";

/**
 * Application service (Voting BC, UC4). It orchestrates the cast: it validates
 * the command, calls the port and normalizes the rejection into a code the UI
 * can act on. It holds no business rules of its own.
 */
export function createCastVoteService(port: VoteDeliveryPort) {
  return {
    async castVote(input: {
      authorizationId: string;
      choice: string;
    }): Promise<CastVoteOutcome> {
      const command = CastVoteCommandSchema.parse(input);
      try {
        const receipt = await port.castVote(command);
        return { ok: true, receipt };
      } catch (error) {
        if (error instanceof VoteCastError) {
          return { ok: false, code: error.code };
        }
        return { ok: false, code: "UNEXPECTED" };
      }
    },
  };
}
