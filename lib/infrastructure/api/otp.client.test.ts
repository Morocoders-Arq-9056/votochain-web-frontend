import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpOtpAdapter } from "./otp.client";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function challenge(overrides: Record<string, unknown> = {}) {
  return {
    challengeId: "ch-1",
    personId: "per-1",
    purpose: "email-verification",
    standing: "OPEN",
    attempts: 0,
    maxAttempts: 5,
    remaining: 5,
    requestedAt: new Date(Date.now() - 1000).toISOString(),
    expiresAt: new Date(Date.now() + 300_000).toISOString(),
    reason: null,
    ...overrides,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("HttpOtpAdapter.request", () => {
  it("POST /challenges con personId y purpose mapeado (email→email-verification)", async () => {
    const fetchMock = vi.fn(async () => jsonResponse(challenge(), 201));
    vi.stubGlobal("fetch", fetchMock);

    const result = await new HttpOtpAdapter().request({
      personId: "per-1",
      purpose: "email",
    });

    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url.endsWith("/challenges")).toBe(true);
    expect(init.method).toBe("POST");
    expect(init.body).toBe(
      JSON.stringify({ personId: "per-1", purpose: "email-verification" }),
    );
    expect(result.purpose).toBe("email");
    expect(result.attemptsLeft).toBe(5);
    expect(result.expiresInSeconds).toBeGreaterThan(0);
  });

  it("con email va a POST /challenges/by-email (recovery pre-login)", async () => {
    const fetchMock = vi.fn(async () => jsonResponse(challenge(), 201));
    vi.stubGlobal("fetch", fetchMock);

    const result = await new HttpOtpAdapter().request({
      email: "ada@votachain.dev",
      purpose: "recovery",
    });

    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url.endsWith("/challenges/by-email")).toBe(true);
    expect(JSON.parse(init.body as string)).toEqual({
      email: "ada@votachain.dev",
      purpose: "password-reset",
    });
    expect(result.purpose).toBe("recovery");
  });

  it("mapea vote→login y ante fallo devuelve el fallback local", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ message: "boom", statusCode: 500 }, 500),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await new HttpOtpAdapter().request({
      personId: "per-1",
      purpose: "vote",
    });

    expect(JSON.parse(
      (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1]
        .body as string,
    ).purpose).toBe("login");
    expect(result).toEqual({
      purpose: "vote",
      expiresInSeconds: 300,
      attemptsLeft: 5,
    });
  });
});

describe("HttpOtpAdapter.verify", () => {
  it("busca el último OPEN y responde el código (ok:true)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(
          [
            challenge({
              challengeId: "ch-old",
              requestedAt: "2026-01-01T00:00:00.000Z",
            }),
            challenge({
              challengeId: "ch-new",
              requestedAt: "2026-01-02T00:00:00.000Z",
            }),
          ],
          200,
        ),
      )
      .mockResolvedValueOnce(jsonResponse(challenge(), 200));
    vi.stubGlobal("fetch", fetchMock);

    const outcome = await new HttpOtpAdapter().verify({
      personId: "per-1",
      purpose: "email",
      code: "482913",
    });

    expect(outcome).toEqual({ ok: true });
    const [listUrl] = fetchMock.mock.calls[0] as unknown as [string];
    expect(listUrl).toContain("/challenges?personId=per-1&purpose=email-verification");
    const [answerUrl, answerInit] = fetchMock.mock.calls[1] as unknown as [
      string,
      RequestInit,
    ];
    expect(answerUrl.endsWith("/challenges/ch-new/answers")).toBe(true);
    expect(answerInit.body).toBe(JSON.stringify({ code: "482913" }));
  });

  it("sin desafío OPEN es INVALIDATED sin responder nada", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse([challenge({ standing: "CONFIRMED" })], 200),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new HttpOtpAdapter().verify({
        personId: "per-1",
        purpose: "email",
        code: "482913",
      }),
    ).resolves.toEqual({ ok: false, code: "INVALIDATED" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("409 'challenge already answered' es INVALIDATED; otro 409 es MISMATCH", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse([challenge()], 200))
      .mockResolvedValueOnce(
        jsonResponse(
          { message: "challenge already answered", statusCode: 409 },
          409,
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new HttpOtpAdapter().verify({
        personId: "per-1",
        purpose: "email",
        code: "482913",
      }),
    ).resolves.toEqual({ ok: false, code: "INVALIDATED" });
  });

  it("410 es EXPIRED", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse([challenge()], 200))
      .mockResolvedValueOnce(
        jsonResponse(
          { message: "validity window elapsed", statusCode: 410 },
          410,
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new HttpOtpAdapter().verify({
        personId: "per-1",
        purpose: "email",
        code: "482913",
      }),
    ).resolves.toEqual({ ok: false, code: "EXPIRED" });
  });

  it("con email lista por email y responde (recovery pre-login)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse([challenge()], 200))
      .mockResolvedValueOnce(jsonResponse(challenge(), 200));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new HttpOtpAdapter().verify({
        email: "ada@votachain.dev",
        purpose: "recovery",
        code: "482913",
      }),
    ).resolves.toEqual({ ok: true });
    const [listUrl] = fetchMock.mock.calls[0] as unknown as [string];
    expect(listUrl).toContain("/challenges?email=ada%40votachain.dev&purpose=password-reset");
  });
});

describe("HttpOtpAdapter.resetSecret", () => {
  it("rota el secreto contra el último CONFIRMED", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(
          [challenge({ standing: "CONFIRMED", challengeId: "ch-c" })],
          200,
        ),
      )
      .mockResolvedValueOnce(jsonResponse({}, 200));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new HttpOtpAdapter().resetSecret({
        email: "ada@votachain.dev",
        purpose: "recovery",
        newSecret: "nueva-clave",
      }),
    ).resolves.toEqual({ ok: true });
    const [secretUrl, secretInit] = fetchMock.mock.calls[1] as unknown as [
      string,
      RequestInit,
    ];
    expect(secretUrl.endsWith("/challenges/ch-c/secret")).toBe(true);
    expect(secretInit.body).toBe(JSON.stringify({ newSecret: "nueva-clave" }));
  });

  it("sin CONFIRMED es ok:false sin POST", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse([challenge({ standing: "OPEN" })], 200),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      new HttpOtpAdapter().resetSecret({
        personId: "per-1",
        purpose: "recovery",
        newSecret: "nueva-clave",
      }),
    ).resolves.toEqual({ ok: false });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
