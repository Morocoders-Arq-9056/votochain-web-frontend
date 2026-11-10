import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpTallyAdapter } from "./tally.client";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("HttpTallyAdapter.getTally", () => {
  it("mapea TallyResource real (counts/turnout/quorumMet) a TallyResult", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(
        {
          proposalId: "prop-001",
          counts: { SI: 48, NO: 18, ABSTENCION: 6 },
          turnout: 72,
          quorumMet: true,
        },
        200,
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const tally = await new HttpTallyAdapter().getTally("prop-001");

    expect(tally.proposalId).toBe("prop-001");
    expect(tally.confirmed).toBe(72);
    expect(tally.quorumReached).toBe(true);
    expect(tally.options).toHaveLength(3);
    expect(tally.options[0]).toMatchObject({
      value: "SI",
      label: "Sí",
      count: 48,
    });
    expect(tally.options[0]?.percent).toBeCloseTo(66.67, 2);
    const [url] = fetchMock.mock.calls[0] as unknown as [string];
    expect(url.endsWith("/proposals/prop-001/tally")).toBe(true);
  });

  it("ausencia de una opción en counts es 0, no error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse(
          { proposalId: "p", counts: { SI: 1 }, turnout: 1, quorumMet: false },
          200,
        ),
      ),
    );

    const tally = await new HttpTallyAdapter().getTally("p");

    expect(tally.options[1]).toMatchObject({ value: "NO", count: 0 });
    expect(tally.quorumReached).toBe(false);
  });

  it("eligible sale del padrón (solo ACTIVE de la comunidad)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(
          {
            proposalId: "prop-001",
            counts: { SI: 48, NO: 18, ABSTENCION: 6 },
            turnout: 72,
            quorumMet: true,
          },
          200,
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse({ proposalId: "prop-001", communityId: "com-1" }, 200),
      )
      .mockResolvedValueOnce(
        jsonResponse(
          [
            { membershipId: "m-1", status: "ACTIVE" },
            { membershipId: "m-2", status: "ACTIVE" },
            { membershipId: "m-3", status: "SUSPENDED" },
            { membershipId: "m-4", status: "TERMINATED" },
          ],
          200,
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const tally = await new HttpTallyAdapter().getTally("prop-001");

    expect(tally.confirmed).toBe(72);
    expect(tally.eligible).toBe(2);
    const [rosterUrl] = fetchMock.mock.calls[2] as unknown as [string];
    expect(rosterUrl).toContain("/memberships?communityId=com-1");
  });

  it("si el padrón falla, eligible degrada a turnout", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(
          { proposalId: "p", counts: { SI: 1 }, turnout: 1, quorumMet: false },
          200,
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse({ message: "gone", statusCode: 404 }, 404),
      );
    vi.stubGlobal("fetch", fetchMock);

    const tally = await new HttpTallyAdapter().getTally("p");

    expect(tally.eligible).toBe(1);
  });
});

describe("HttpTallyAdapter.closeProposal", () => {
  it("sin confirmedIrreversible devuelve STEP_1 sin HTTP (paso 1 solo UI)", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}, 200));
    vi.stubGlobal("fetch", fetchMock);

    const outcome = await new HttpTallyAdapter().closeProposal({
      proposalId: "prop-001",
      reason: "Motivo válido",
      confirmedIrreversible: false,
    });

    expect(outcome).toEqual({ ok: true, step: "STEP_1" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("confirmado hace POST sin body a /proposals/:id/close", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ proposalId: "prop-001", status: "CLOSED" }, 200),
    );
    vi.stubGlobal("fetch", fetchMock);

    const outcome = await new HttpTallyAdapter().closeProposal({
      proposalId: "prop-001",
      reason: "Motivo válido",
      confirmedIrreversible: true,
    });

    expect(outcome).toEqual({ ok: true, step: "CLOSED" });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url.endsWith("/proposals/prop-001/close")).toBe(true);
    expect(init.method).toBe("POST");
    expect(init.body).toBeUndefined();
  });

  it("404 del back es NOT_OPEN", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({ message: "Unknown proposal", statusCode: 404 }, 404),
      ),
    );

    const outcome = await new HttpTallyAdapter().closeProposal({
      proposalId: "nope",
      reason: "Motivo válido",
      confirmedIrreversible: true,
    });

    expect(outcome).toEqual({ ok: false, code: "NOT_OPEN" });
  });
});

describe("HttpTallyAdapter.closeStep", () => {
  it.each([
    ["DRAFT", "STEP_1"],
    ["OPEN", "STEP_2"],
    ["CLOSED", "CLOSED"],
    ["TALLIED", "CLOSED"],
  ] as const)("status %s del back es paso %s", async (status, step) => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({ proposalId: "p", status, options: [] }, 200),
      ),
    );

    await expect(new HttpTallyAdapter().closeStep("p")).resolves.toEqual({
      step,
    });
  });
});
