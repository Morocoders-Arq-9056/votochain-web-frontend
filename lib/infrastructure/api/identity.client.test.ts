import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpIdentityAdapter } from "./identity.client";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function examination(overrides: Record<string, unknown> = {}) {
  return {
    id: "ex-1",
    personId: "per-1",
    documentRef: "DNI:anverso.jpg",
    standing: "CONCLUDED",
    verdict: "MATCH",
    consumed: false,
    ...overrides,
  };
}

const UPLOAD = {
  personId: "per-1",
  upload: {
    documentType: "DNI",
    frontName: "anverso.jpg",
    backName: "reverso.jpg",
    selfieName: "rostro.jpg",
    acceptedPolicyVersion: "v1",
  },
} as const;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("HttpIdentityAdapter.uploadDocument", () => {
  it("POST /examinations con personId+documentRef y luego examine", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(examination(), 201))
      .mockResolvedValueOnce(jsonResponse(examination(), 200));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new HttpIdentityAdapter().uploadDocument({ ...UPLOAD }),
    ).resolves.toEqual({ verdict: "MATCH" });

    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url.endsWith("/examinations")).toBe(true);
    expect(JSON.parse(init.body as string)).toEqual({
      personId: "per-1",
      documentRef: "DNI:anverso.jpg",
    });
    const [examineUrl] = fetchMock.mock.calls[1] as unknown as [string];
    expect(examineUrl.endsWith("/examinations/ex-1/examine")).toBe(true);
  });

  it("NO_MATCH→MISMATCH, UNREADABLE→UNDER_REVIEW", async () => {
    for (const [verdict, expected] of [
      ["NO_MATCH", "MISMATCH"],
      ["UNREADABLE", "UNDER_REVIEW"],
    ] as const) {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(jsonResponse(examination(), 201))
        .mockResolvedValueOnce(jsonResponse(examination({ verdict }), 200));
      vi.stubGlobal("fetch", fetchMock);

      await expect(
        new HttpIdentityAdapter().uploadDocument({ ...UPLOAD }),
      ).resolves.toEqual({ verdict: expected });
    }
  });

  it("409 ya-OPEN examina el abierto del historial", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ message: "already open", statusCode: 409 }, 409),
      )
      .mockResolvedValueOnce(
        jsonResponse(
          { items: [examination({ id: "ex-open", standing: "OPEN" })] },
          200,
        ),
      )
      .mockResolvedValueOnce(jsonResponse(examination({ id: "ex-open" }), 200));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new HttpIdentityAdapter().uploadDocument({ ...UPLOAD }),
    ).resolves.toEqual({ verdict: "MATCH" });
    const [examineUrl] = fetchMock.mock.calls[2] as unknown as [string];
    expect(examineUrl.endsWith("/examinations/ex-open/examine")).toBe(true);
  });
});

describe("HttpIdentityAdapter biometría", () => {
  it("referenceStatus mapea verifiedNow a ACTIVE/NOT_VERIFIED", async () => {
    for (const [verifiedNow, expected] of [
      [true, "ACTIVE"],
      [false, "NOT_VERIFIED"],
    ] as const) {
      vi.stubGlobal(
        "fetch",
        vi.fn(async () =>
          jsonResponse({ verifiedNow, reason: null }, 200),
        ),
      );
      await expect(
        new HttpIdentityAdapter().referenceStatus({ personId: "per-1" }),
      ).resolves.toEqual({ status: expected });
    }
  });

  it("enrollReference: 409 con viva es ACTIVE", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({ message: "live exists", statusCode: 409 }, 409),
      ),
    );
    await expect(
      new HttpIdentityAdapter().enrollReference({ personId: "per-1" }),
    ).resolves.toEqual({ status: "ACTIVE" });
  });

  it("start+confirm recorren liveness→comparison→verdict", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ id: "att-1", personId: "per-1", standing: "CHALLENGE_OPEN" }, 201),
      )
      .mockResolvedValueOnce(
        jsonResponse({ id: "att-1", personId: "per-1", standing: "LIVENESS_PASSED" }, 200),
      )
      .mockResolvedValueOnce(
        jsonResponse({ id: "att-1", personId: "per-1", standing: "COMPARISON_REQUESTED" }, 200),
      )
      .mockResolvedValueOnce(
        jsonResponse({ id: "att-1", personId: "per-1", standing: "VERIFIED" }, 200),
      );
    vi.stubGlobal("fetch", fetchMock);

    const started = await new HttpIdentityAdapter().startLiveness({
      personId: "per-1",
    });
    expect(started.attemptId).toBe("att-1");

    await expect(
      new HttpIdentityAdapter().confirmLiveness({ attemptId: "att-1" }),
    ).resolves.toEqual({ status: "VERIFIED", verdict: "VERIFIED" });
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("verdict NO_VERIFIED mapea a NOT_VERIFIED", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({}, 200))
      .mockResolvedValueOnce(jsonResponse({}, 200))
      .mockResolvedValueOnce(
        jsonResponse({ id: "a", personId: "p", standing: "NOT_VERIFIED" }, 200),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new HttpIdentityAdapter().confirmLiveness({ attemptId: "a" }),
    ).resolves.toEqual({ status: "NOT_VERIFIED", verdict: "NOT_VERIFIED" });
  });
});
