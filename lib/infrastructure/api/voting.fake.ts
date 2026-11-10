import type { CastVoteCommand } from "@/lib/domain/voting/cast-vote.vo";
import type { VoteDeliveryPort } from "@/lib/domain/voting/ports";
import type { VoterReceipt } from "@/lib/domain/voting/voter-receipt.vo";

/**
 * Prototype adapter (F7 swaps it for the real Voting BC client). It mimics the
 * backend's lifecycle: a cast vote is SIGNED until the delivery confirms it.
 */
export class FakeVotingDeliveryAdapter implements VoteDeliveryPort {
  async castVote(command: CastVoteCommand): Promise<VoterReceipt> {
    return {
      voteId: "demo",
      proposalId: "propuesta-demo",
      voterAddress: "0x0000000000000000000000000000000000000000",
      choice: command.choice,
      status: "SIGNED",
    };
  }

  async getReceipt(proposalId: string): Promise<VoterReceipt | null> {
    if (proposalId === "fallido") {
      return {
        voteId: "v-demo-fallido",
        proposalId,
        voterAddress: "0x0000000000000000000000000000000000000000",
        choice: "SI",
        status: "FAILED",
      };
    }
    if (proposalId !== "demo") return null;

    return {
      voteId: "v-demo",
      proposalId,
      voterAddress: "0x0000000000000000000000000000000000000000",
      choice: "SI",
      status: "CONFIRMED",
      txHash:
        "0x9f3a7c21b8e4d5f6a2c9b0d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
    };
  }

  async getReceiptById(voteId: string): Promise<VoterReceipt | null> {
    if (voteId === "demo") return this.getReceipt("demo");
    return null;
  }
}
