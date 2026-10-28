import { afterEach, describe, expect, it, vi } from "vitest";
import { VotingAuthorizationAdapter } from "./authorization.client";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("VotingAuthorizationAdapter", () => {
  it("reporta la autorización concedida con su vigencia en PET", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(
        {
          authorizationId: "AUT-4821-0212",
          proposalId: "p-1",
          voterAddress: "0xabc",
          status: "PENDING",
          expiresAt: "2026-02-12T15:05:00.000Z",
        },
        201,
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const facts = await new VotingAuthorizationAdapter().request("p-1");

    expect(facts.authorizationState).toBe("GRANTED");
    expect(facts.authorization?.code).toBe("AUT-4821-0212");
    expect(facts.authorization?.validUntil).toMatch(/PET \(UTC−5\)/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/authorizations");
    expect(init.method).toBe("POST");
    expect(init.body).toContain('"proposalId":"p-1"');
  });

  it("un 409 se traduce en denegación con motivo", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({ message: "duplicate pending authorization" }, 409),
      ),
    );

    const facts = await new VotingAuthorizationAdapter().request("p-1");

    expect(facts.authorizationState).toBe("DENIED");
    expect(facts.denialReason).toMatch(/pendiente/);
  });

  it("una autorización expirada se reporta como expirada", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse(
          {
            authorizationId: "AUT-1",
            proposalId: "p-1",
            voterAddress: "0xabc",
            status: "EXPIRED",
            expiresAt: "2026-02-12T15:05:00.000Z",
          },
          201,
        ),
      ),
    );

    const facts = await new VotingAuthorizationAdapter().request("p-1");

    expect(facts.authorizationState).toBe("EXPIRED");
  });
});
