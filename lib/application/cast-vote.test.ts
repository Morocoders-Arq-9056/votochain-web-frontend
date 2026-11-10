import { describe, expect, it, vi } from "vitest";
import { createCastVoteService } from "./cast-vote";
import type { VoteDeliveryPort } from "@/lib/domain/voting/ports";
import { VoteCastError } from "@/lib/domain/voting/vote-cast-error";
import type { VoterReceipt } from "@/lib/domain/voting/voter-receipt.vo";

const receipt: VoterReceipt = {
  voteId: "v-1",
  proposalId: "p-1",
  voterAddress: "0xabc",
  choice: "SI",
  status: "SIGNED",
};

function portWith(
  castVote: VoteDeliveryPort["castVote"],
): VoteDeliveryPort {
  return {
    castVote,
    getReceipt: vi.fn(async () => null),
    getReceiptById: vi.fn(async () => null),
  };
}

describe("createCastVoteService", () => {
  it("devuelve el recibo cuando el port acepta el voto", async () => {
    const service = createCastVoteService(
      portWith(async () => receipt),
    );
    const outcome = await service.castVote({
      authorizationId: "AUT-1",
      choice: "SI",
    });

    expect(outcome).toEqual({ ok: true, receipt });
  });

  it("traduce un rechazo del port a un código de dominio", async () => {
    const service = createCastVoteService(
      portWith(async () => {
        throw new VoteCastError("DOUBLE_VOTE");
      }),
    );
    const outcome = await service.castVote({
      authorizationId: "AUT-1",
      choice: "SI",
    });

    expect(outcome).toEqual({ ok: false, code: "DOUBLE_VOTE" });
  });

  it("un error inesperado no escapa del servicio", async () => {
    const service = createCastVoteService(
      portWith(async () => {
        throw new Error("boom");
      }),
    );
    const outcome = await service.castVote({
      authorizationId: "AUT-1",
      choice: "SI",
    });

    expect(outcome).toEqual({ ok: false, code: "UNEXPECTED" });
  });

  it("valida el comando antes de llamar al port", async () => {
    const castVote = vi.fn(async () => receipt);
    const service = createCastVoteService(portWith(castVote));

    await expect(
      service.castVote({ authorizationId: "", choice: "SI" }),
    ).rejects.toThrow();
    expect(castVote).not.toHaveBeenCalled();
  });
});
