import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpAuthAdapter } from "./auth.client";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("HttpAuthAdapter.changePassword", () => {
  it("hace PATCH a /users/:id/secret solo con newSecret", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ userId: "usr-1", standing: "ACTIVE" }, 200),
    );
    vi.stubGlobal("fetch", fetchMock);

    const outcome = await new HttpAuthAdapter().changePassword(
      "usr-1",
      "nuevo-secreto",
    );

    expect(outcome).toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url.endsWith("/users/usr-1/secret")).toBe(true);
    expect(init.method).toBe("PATCH");
    expect(init.body).toBe(JSON.stringify({ newSecret: "nuevo-secreto" }));
  });

  it("404 del back es ok:false, no excepción", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({ message: "User not found", statusCode: 404 }, 404),
      ),
    );

    await expect(
      new HttpAuthAdapter().changePassword("nadie", "x"),
    ).resolves.toEqual({ ok: false });
  });
});
