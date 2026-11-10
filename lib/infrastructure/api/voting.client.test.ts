import { afterEach, describe, expect, it, vi } from "vitest";
import { VotingDeliveryAdapter, idempotencyKeyFor } from "./voting.client";
import { toVoteCastErrorCode } from "./error-mapping";
import { toVoterReceipt } from "@/lib/infrastructure/mappers/voting.mapper";
import { VoteCastError } from "@/lib/domain/voting/vote-cast-error";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("VotingDeliveryAdapter", () => {
  it("envía Idempotency-Key = authorizationId y devuelve el recibo", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(
        {
          voteId: "v-1",
          proposalId: "p-1",
          voterAddress: "0xabc",
          choice: "SI",
          status: "SIGNED",
          txHash: null,
        },
        201,
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const receipt = await new VotingDeliveryAdapter().castVote({
      authorizationId: "AUT-4821-0212",
      choice: "SI",
    });

    expect(receipt.status).toBe("SIGNED");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect((init.headers as Record<string, string>)["Idempotency-Key"]).toBe(
      "AUT-4821-0212",
    );
    expect(init.body).toBe(
      JSON.stringify({ authorizationId: "AUT-4821-0212", choice: "SI" }),
    );
  });

  it("no reintenta un 409 y lo traduce a DOUBLE_VOTE", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ message: "ReplayRejected", statusCode: 409 }, 409),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new VotingDeliveryAdapter().castVote({
        authorizationId: "AUT-4821-0212",
        choice: "SI",
      }),
    ).rejects.toMatchObject({ code: "DOUBLE_VOTE" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("reintenta una sola vez en 5xx con la misma key", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ message: "boom", statusCode: 500 }, 500),
      )
      .mockResolvedValueOnce(
        jsonResponse(
          {
            voteId: "v-1",
            proposalId: "p-1",
            voterAddress: "0xabc",
            choice: "SI",
            status: "SIGNED",
            txHash: null,
          },
          201,
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    await new VotingDeliveryAdapter().castVote({
      authorizationId: "AUT-4821-0212",
      choice: "SI",
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const [, init] of fetchMock.mock.calls as unknown as [
      string,
      RequestInit,
    ][]) {
      expect((init.headers as Record<string, string>)["Idempotency-Key"]).toBe(
        "AUT-4821-0212",
      );
    }
  });

  it("agota los reintentos y traduce el último error", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ message: "boom", statusCode: 500 }, 500),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new VotingDeliveryAdapter().castVote({
        authorizationId: "AUT-4821-0212",
        choice: "SI",
      }),
    ).rejects.toBeInstanceOf(VoteCastError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("getReceipt devuelve null cuando el voto no existe", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ message: "not found" }, 404)),
    );

    await expect(
      new VotingDeliveryAdapter().getReceipt("p-1", "0xabc"),
    ).resolves.toBeNull();
  });

  it("getReceiptById mapea el proof (recovered como votante)", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(
        {
          voteId: "v-1",
          proposalId: "p-1",
          choice: "SI",
          signature: { v: 27, r: "0xr", s: "0xs" },
          txHash: null,
          blockNumber: null,
          recovered: "0xabc",
          status: "SIGNED",
        },
        200,
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const receipt = await new VotingDeliveryAdapter().getReceiptById("v-1");

    expect(receipt).toMatchObject({
      voteId: "v-1",
      voterAddress: "0xabc",
      status: "SIGNED",
    });
    const [url] = fetchMock.mock.calls[0] as unknown as [string];
    expect(url.endsWith("/votes/v-1")).toBe(true);
  });

  it("getReceiptById devuelve null en 404", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ message: "not found" }, 404)),
    );

    await expect(
      new VotingDeliveryAdapter().getReceiptById("v-missing"),
    ).resolves.toBeNull();
  });
});

describe("idempotencyKeyFor", () => {
  it("deriva la key del authorizationId (una autorización = un voto)", () => {
    expect(
      idempotencyKeyFor({ authorizationId: "AUT-1", choice: "SI" }),
    ).toBe("AUT-1");
  });
});

describe("error-mapping", () => {
  it("traduce la tabla de errores del backend", () => {
    expect(toVoteCastErrorCode(409, "ReplayRejected")).toBe("DOUBLE_VOTE");
    expect(toVoteCastErrorCode(409, "AuthorizationAlreadyConsumed")).toBe(
      "DOUBLE_VOTE",
    );
    expect(toVoteCastErrorCode(422, "ProposalNotOpen")).toBe("LATE_VOTE");
    expect(toVoteCastErrorCode(410, "AuthorizationExpired")).toBe(
      "AUTHORIZATION_EXPIRED",
    );
    expect(toVoteCastErrorCode(404, "vote not found")).toBe("NOT_FOUND");
    expect(toVoteCastErrorCode(500, "boom")).toBe("UNAVAILABLE");
    expect(toVoteCastErrorCode(0, "NETWORK_ERROR")).toBe("UNAVAILABLE");
    expect(toVoteCastErrorCode(418, "teapot")).toBe("UNEXPECTED");
  });
});

describe("voting.mapper", () => {
  it("oculta el hash salvo CONFIRMED", () => {
    const pending = toVoterReceipt({
      voteId: "v-1",
      proposalId: "p-1",
      voterAddress: "0xabc",
      choice: "SI",
      status: "SIGNED",
      txHash: "0xhash",
    });
    expect(pending.txHash).toBeUndefined();

    const confirmed = toVoterReceipt({
      voteId: "v-1",
      proposalId: "p-1",
      voterAddress: "0xabc",
      choice: "SI",
      status: "CONFIRMED",
      txHash: "0xhash",
    });
    expect(confirmed.txHash).toBe("0xhash");
  });
});
