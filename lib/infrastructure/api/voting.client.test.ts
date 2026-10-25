import { afterEach, describe, expect, it, vi } from "vitest";
import {
  castVote,
  getVoteReceipt,
} from "@/lib/infrastructure/api/voting.client";
import {
  toCastVoteError,
  toReceipt,
} from "@/lib/infrastructure/mappers/voting.mapper";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("voting.client castVote", () => {
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

    await castVote({ authorizationId: "AUT-4821-0212", choice: "SI" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect((init.headers as Record<string, string>)["Idempotency-Key"]).toBe(
      "AUT-4821-0212",
    );
    expect(init.body).toBe(
      JSON.stringify({ authorizationId: "AUT-4821-0212", choice: "SI" }),
    );
  });

  it("no reintenta un 409 y traduce a DoubleVote", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ message: "ReplayRejected", statusCode: 409 }, 409),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      castVote({ authorizationId: "AUT-4821-0212", choice: "SI" }),
    ).rejects.toThrow("Ya usó esta autorización");
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

    await castVote({ authorizationId: "AUT-4821-0212", choice: "SI" });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const [, init] of fetchMock.mock.calls as unknown as [string, RequestInit][]) {
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
      castVote({ authorizationId: "AUT-4821-0212", choice: "SI" }),
    ).rejects.toThrow("Ocurrió un error. Intente de nuevo.");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe("voting.client getVoteReceipt", () => {
  it("consulta el journey por propuesta y votante", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(
        {
          voteId: "v-1",
          proposalId: "p-1",
          voterAddress: "0xabc",
          choice: "SI",
          status: "CONFIRMED",
          txHash: "0xhash",
        },
        200,
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const receipt = await getVoteReceipt("p-1", "0xabc");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/votes/receipt?proposal=p-1&voter=0xabc");
    expect(receipt.result.status).toBe("CONFIRMED");
  });
});

describe("voting.mapper", () => {
  it("traduce la tabla de errores del backend", () => {
    expect(toCastVoteError(409, "ReplayRejected")).toBe(
      "Ya usó esta autorización",
    );
    expect(toCastVoteError(409, "AuthorizationAlreadyConsumed")).toBe(
      "Ya usó esta autorización",
    );
    expect(toCastVoteError(422, "ProposalNotOpen")).toBe(
      "Votación cerrada, voto tardío rechazado",
    );
    expect(toCastVoteError(410, "AuthorizationExpired")).toContain("venció");
    expect(toCastVoteError(404, "vote not found")).toContain("inicio");
    expect(toCastVoteError(500, "boom")).toBe(
      "Ocurrió un error. Intente de nuevo.",
    );
  });

  it("oculta el hash salvo CONFIRMED", () => {
    const pending = toReceipt({
      voteId: "v-1",
      proposalId: "p-1",
      voterAddress: "0xabc",
      choice: "SI",
      status: "SIGNED",
      txHash: "0xhash",
    });
    expect(pending.result.status).toBe("FAILED");
    if (pending.result.status === "FAILED") {
      expect(pending.result).not.toHaveProperty("hash");
    }

    const confirmed = toReceipt({
      voteId: "v-1",
      proposalId: "p-1",
      voterAddress: "0xabc",
      choice: "SI",
      status: "CONFIRMED",
      txHash: "0xhash",
    });
    expect(confirmed.result.status).toBe("CONFIRMED");
    if (confirmed.result.status === "CONFIRMED") {
      expect(confirmed.result.hash).toBe("0xhash");
    }
  });
});
